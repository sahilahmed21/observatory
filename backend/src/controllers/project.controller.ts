import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as ProjectService from '../services/project.service';

export const create = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        const userId = req.user!.userId;
        if (!name) {
            return res.status(400).json({ message: 'Project name is required' });
        }
        const project = await ProjectService.createProjectAndApiKey(name, userId);
        return res.status(201).json(project);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
}