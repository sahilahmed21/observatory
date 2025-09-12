import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto';

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