import { Queue } from 'bullmq';

// BullMQ's Queue constructor takes connection options directly.
// It will create and manage its own efficient Redis connection.
export const metricsQueue = new Queue('metrics-processing', {
    connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    },
});