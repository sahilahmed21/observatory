import { Router } from 'express';
import { apiKeyMiddleware } from '../middleware/apiKey.middleware';
import { validate } from '../middleware/validate';
import { ingestMetricsSchema } from '../validators/metrics.validator';
import * as MetricsController from '../controllers/metrics.controller';

const router = Router();

router.post('/', apiKeyMiddleware, validate(ingestMetricsSchema), MetricsController.ingest);

export default router;