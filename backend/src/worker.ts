import { Worker } from 'bullmq';
import { PrismaClient, Metric } from '@prisma/client';
import { createClient } from 'redis';
import { sendEmailAlert } from './services/notification.service';


const prisma = new PrismaClient();

console.log('Alert worker starting...');

const worker = new Worker('metrics-processing', async job => {
    const metric = job.data as Metric;
    console.log(`[Worker] Processing metric for project ${metric.projectId}`);

    const alertRules = await prisma.alertRule.findMany({
        where: {
            projectId: metric.projectId,
            // Only get rules relevant to this metric's endpoint
            OR: [
                { endpointFilter: null },
                { endpointFilter: metric.endpoint }
            ]
        },
        include: { project: { include: { user: true } } } // 2. Include user data to get their email
    });


    for (const rule of alertRules) {
        let isBreached = false;
        if (rule.metric === 'latency' && (!rule.endpointFilter || rule.endpointFilter === metric.endpoint)) {
            if (rule.operator === '>' && metric.responseTime > rule.threshold) {
                isBreached = true;
            }
            // Add more operators like '<', '==' etc. later
        }

        if (isBreached) {
            console.log(`[Worker] Rule '${rule.name}' breached! Threshold: ${rule.threshold}, Value: ${metric.responseTime}`);
            // Notification logic will go here
            const userEmail = rule.project.user.email;
            await sendEmailAlert(rule, metric.responseTime, userEmail);

        }
    }
}, {
    // Pass the connection options directly to BullMQ
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