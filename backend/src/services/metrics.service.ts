import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

const prisma = new PrismaClient();
// Create a separate client for publishing
const publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

interface MetricData {
    endpoint: string;
    responseTime: number;
    statusCode: number;
}

export const ingestMetrics = async (projectId: string, metrics: MetricData[]) => {
    const metricsToCreate = metrics.map(metric => ({
        ...metric,
        projectId: projectId,
    }));

    const result = await prisma.metric.createMany({ data: metricsToCreate });

    // After saving, publish each new metric to Redis
    if (result.count > 0) {
        const createdMetrics = await prisma.metric.findMany({
            where: { projectId },
            orderBy: { timestamp: 'desc' },
            take: result.count
        });
        createdMetrics.forEach(metric => {
            // With ioredis, publish is straightforward
            publisher.publish('metrics-channel', JSON.stringify(metric));
        });
    }

    return result;
};
