import { Router } from 'express';
import * as ProjectController from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// This is the key part: authMiddleware runs before the controller.
// If the user isn't authenticated, the controller will never be reached.
router.post('/', authMiddleware, ProjectController.create);
router.get('/', authMiddleware, ProjectController.getAll);
router.get('/:projectId/metrics', authMiddleware, ProjectController.getMetrics);

export default router;