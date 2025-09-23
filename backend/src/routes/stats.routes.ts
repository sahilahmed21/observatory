import { Router } from 'express';
import * as StatsController from '../controllers/stats.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', authMiddleware, StatsController.getStats);

export default router;