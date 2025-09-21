import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const Prisma = new PrismaClient();

export interface ApiKeyRequest extends Request {
    project?: { id: string; name: string };
}

export const apiKeyMiddleware = async (req: ApiKeyRequest, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;
    if (!apiKey) {
        return res.status(401).json({ message: 'Unauthorized: API Key is required' })
    }
    try {
        const apiKeyRecord = await Prisma.apiKey.findUnique({
            where: { key: apiKey },
            include: { project: true },
        });
        if (!apiKeyRecord) {
            return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
        }
        req.project = { id: apiKeyRecord.project.id, name: apiKeyRecord.project.name };
        next();
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}