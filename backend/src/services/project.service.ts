import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';
import { subHours } from 'date-fns';

const prisma = new PrismaClient();
export const getProjectsByUserId = async (userId: string) => {
    const projects = prisma.project.findMany({
        where: {
            userId: userId,

        },
        include: {
            apiKeys: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return projects;
}
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
