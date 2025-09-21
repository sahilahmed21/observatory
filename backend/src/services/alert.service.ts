import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getRulesForProject = (projectId: string) => {
    return prisma.alertRule.findMany({ where: { projectId } });
};

export const createRule = (data: any) => {
    return prisma.alertRule.create({ data });
};

export const deleteRule = (ruleId: string) => {
    return prisma.alertRule.delete({ where: { id: ruleId } });
};