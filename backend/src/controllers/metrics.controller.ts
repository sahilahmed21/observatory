import { Response } from 'express';
import { ApiKeyRequest } from '../middleware/apiKey.middleware';
import * as MetricsService from '../services/metrics.service';

export const ingest = async (req: ApiKeyRequest, res: Response) => {
    try {
        const projectId = req.project!.id;
        const metrics = req.body;

        const result = await MetricsService.ingestMetrics(projectId, metrics);
        res.status(201).json({ message: 'Metrics ingested successfully', count: result?.count || 0 });
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to ingest metrics', error: error.message });
    }
};