import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as StatsService from '../services/stats.service';

export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const timeframe = parseInt(req.query.timeframe as string) || 24;
        const stats = await StatsService.getProjectStats(projectId, timeframe);
        res.status(200).json(stats);
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
};