import { PrismaClient } from '@prisma/client';
import { metricsQueue } from '../queue';
const prisma = new PrismaClient();

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

    const result = await prisma.metric.createMany({
        data: metricsToCreate,
    });
    if (result.count > 0) {
        // Find the metrics we just created to get their full data
        const createdMetrics = await prisma.metric.findMany({
            where: { projectId },
            orderBy: { timestamp: 'desc' },
            take: result.count
        });

        // 2. Add each new metric to the queue for processing
        for (const metric of createdMetrics) {
            await metricsQueue.add('process-metric', metric);
        }

        return result;
    }
}