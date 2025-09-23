// src/services/stats.service.ts
import { PrismaClient } from '@prisma/client';
import { subHours } from 'date-fns';

const prisma = new PrismaClient();

const calculatePercentile = (arr: number[], percentile: number): number => {
    if (arr.length === 0) return 0;
    arr.sort((a, b) => a - b);
    const index = (percentile / 100) * arr.length;
    return arr[Math.ceil(index) - 1];
};

export const getProjectStats = async (projectId: string, timeframeHours: number) => {
    const sinceDate = subHours(new Date(), timeframeHours);
    const metrics = await prisma.metric.findMany({
        where: { projectId, timestamp: { gte: sinceDate } },
    });

    if (metrics.length === 0) {
        return {
            p95: 0, p99: 0, apdexScore: 0,
            statusCodeBreakdown: {}, endpointBreakdown: [],
        };
    }

    // --- APDEX CALCULATION ---
    const apdexT = 150; // Target threshold in ms
    let satisfiedCount = 0;
    let toleratingCount = 0;
    metrics.forEach(m => {
        if (m.responseTime <= apdexT) satisfiedCount++;
        else if (m.responseTime <= apdexT * 4) toleratingCount++;
    });
    const apdexScore = (satisfiedCount + (toleratingCount / 2)) / metrics.length;
    // -------------------------

    const responseTimes = metrics.map(m => m.responseTime);
    const p95 = calculatePercentile(responseTimes, 95);
    const p99 = calculatePercentile(responseTimes, 99);

    const statusCodeBreakdown = metrics.reduce((acc, m) => {
        const group = `${Math.floor(m.statusCode / 100)}xx`;
        acc[group] = (acc[group] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const endpointData = metrics.reduce((acc, m) => {
        if (!acc[m.endpoint]) {
            acc[m.endpoint] = { totalRequests: 0, totalLatency: 0, errorCount: 0 };
        }
        acc[m.endpoint].totalRequests++;
        acc[m.endpoint].totalLatency += m.responseTime;
        if (m.statusCode >= 400) acc[m.endpoint].errorCount++;
        return acc;
    }, {} as Record<string, { totalRequests: number, totalLatency: number, errorCount: number }>);

    const endpointBreakdown = Object.entries(endpointData).map(([endpoint, data]) => ({
        endpoint,
        avgLatency: data.totalLatency / data.totalRequests,
        errorRate: (data.errorCount / data.totalRequests) * 100,
        requests: data.totalRequests,
    }));

    return { p95, p99, apdexScore, statusCodeBreakdown, endpointBreakdown };
};