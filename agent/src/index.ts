import { Request, Response, NextFunction } from "express";
import axios from 'axios'
interface Metric {
    endpoint: string;
    responseTime: number;
    statusCode: number;
}

interface AgentConfig {
    apiKey: string;
    endpoint?: string;
    batchInterval?: number;
    maxBatchSize?: number;
}

class ObservatoryAgent {
    private apiKey: string;
    private endpoint: string;
    private batchInterval: number;
    private maxBatchSize: number;
    private metricsBuffer: Metric[] = [];
    private intervalId?: NodeJS.Timeout;

    constructor(config: AgentConfig) {
        this.apiKey = config.apiKey;
        this.endpoint = config.endpoint || 'http://localhost:5000/api/metrics';
        this.batchInterval = config.batchInterval || 15000; // 15 seconds
        this.maxBatchSize = config.maxBatchSize || 50;
    }
    public start() {
        this.intervalId = setInterval(() => {
            this.sendMetrics();
        }, this.batchInterval);
    }

    public stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
    private async sendMetrics() {
        if (this.metricsBuffer.length === 0) {
            return;
        }
        const metricsToSend = [...this.metricsBuffer];
        this.metricsBuffer = [];

        try {
            console.log(`[Observatory] Sending batch of ${metricsToSend.length} metrics.`);
            await axios.post(this.endpoint, metricsToSend, {
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                },

            });
        } catch (error: any) {
            console.error('[Observatory] Failed to send metrics:', error.response?.data || error.message);
            // If sending fails, add the metrics back to the buffer to retry later.
            this.metricsBuffer.unshift(...metricsToSend);
        }
    }

    public middleware = (req: Request, res: Response, next: NextFunction) => {
        const startTime = process.hrtime.bigint();
        res.on('finish', () => {
            const endTime = process.hrtime.bigint();
            const responseTime = Number((endTime - startTime) / 1_000_000n);
            const metric: Metric = {
                endpoint: req.originalUrl || req.url,
                responseTime,
                statusCode: res.statusCode,
            };
            this.metricsBuffer.push(metric);
            if (this.metricsBuffer.length >= this.maxBatchSize) {
                this.sendMetrics();
            }

        });
        next();
    };
};

export function createObservatoryAgent(config: AgentConfig) {
    if (!config.apiKey) {
        throw new Error('[Observatory] API Key is required.');
    }
    const agent = new ObservatoryAgent(config);
    agent.start();
    return agent.middleware;
}
