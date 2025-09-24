import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { subHours } from 'date-fns';

const prisma = new PrismaClient();
export const getProjectsByUserId = async (userId: string) => {
    const projects = await prisma.project.findMany({
        where: { userId: userId },
        include: { apiKeys: true },
        orderBy: { createdAt: 'desc' },
    });

    // For each project, fetch its recent metrics and calculate stats
    const projectsWithStats = await Promise.all(
        projects.map(async (project) => {
            const sinceDate = subHours(new Date(), 24);
            const metrics = await prisma.metric.findMany({
                where: { projectId: project.id, timestamp: { gte: sinceDate } },
            });

            if (metrics.length === 0) {
                return { ...project, avgLatency: 0, successRate: 100, totalRequests: 0 };
            }

            const totalLatency = metrics.reduce((acc, m) => acc + m.responseTime, 0);
            const avgLatency = totalLatency / metrics.length;
            const errorCount = metrics.filter(m => m.statusCode >= 400).length;
            const successRate = (1 - (errorCount / metrics.length)) * 100;

            return { ...project, avgLatency, successRate, totalRequests: metrics.length };
        })
    );

    return projectsWithStats;
};
export const createProjectAndApiKey = async (projectName: string, userId: string) => {
    const apiKey = randomBytes(24).toString('hex');
    const newProject = await prisma.project.create({
        data: {
            name: projectName,
            userId: userId,
            apiKeys: {
                create: {
                    key: apiKey
                }
            }
        },
        include: {
            apiKeys: true,
        }
    });
    return newProject;
}
export const getProjectMetrics = async (projectId: string, timeframeHours: number) => {
    const sinceDate = subHours(new Date(), timeframeHours);
    const metrics = await prisma.metric.findMany({
        where: { projectId: projectId, timestamp: { gte: sinceDate } },
        orderBy: { timestamp: 'asc' },
    });
    return metrics;
};

