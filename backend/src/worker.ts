
import express from 'express';
import { Worker } from 'bullmq';
import { PrismaClient, Metric } from '@prisma/client';
import { createClient } from 'redis';
import { sendEmailAlert } from './services/notification.service';

// --- 1. SETUP THE WEB SERVER ---
const app = express();
const PORT = process.env.PORT || 10000; // Render provides a PORT env var

app.get('/health', (req, res) => {
    // This is the endpoint our uptime monitor will ping.
    res.status(200).send('Worker is healthy and running.');
});

// --- 2. THE ORIGINAL WORKER LOGIC ---
const startWorker = () => {
    const prisma = new PrismaClient();
    const redisConnection = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

    console.log('Alert worker logic starting...');

    const worker = new Worker('metrics-processing', async job => {
        const metric = job.data as Metric;
        console.log(`[Worker] Processing metric for project ${metric.projectId}`);

        const alertRules = await prisma.alertRule.findMany({
            where: {
                projectId: metric.projectId,
                OR: [
                    { endpointFilter: null },
                    { endpointFilter: '*' },
                    { endpointFilter: metric.endpoint },
                ]
            },
            include: { project: { include: { user: true } } }
        });

        for (const rule of alertRules) {
            let isBreached = false;
            if (rule.metric === 'latency' && rule.operator === '>' && metric.responseTime > rule.threshold) {
                isBreached = true;
            }

            if (isBreached) {
                console.log(`[Worker] Rule '${rule.name}' breached!`);
                const userEmail = rule.project.user.email;
                await sendEmailAlert(rule, metric.responseTime, userEmail);
            }
        }
    }, {
        connection: {
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: parseInt(process.env.REDIS_PORT || '6379')
        }
    });

    worker.on('completed', job => {
        console.log(`[Worker] Job ${job.id} has completed!`);
    });

    worker.on('failed', (job, err) => {
        console.error(`[Worker] Job ${job?.id} has failed with ${err.message}`);
    });
}

// --- 3. START EVERYTHING ---
app.listen(PORT, () => {
    console.log(`Worker's health check server running on port ${PORT}`);
    // Start the actual worker logic after the server is up.
    startWorker();
});