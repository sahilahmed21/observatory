import { Router } from 'express';
import * as AlertController from '../controllers/alert.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true }); // mergeParams is important for nested routes

router.get('/', authMiddleware, AlertController.getRules);
router.post('/', authMiddleware, AlertController.createRule);
router.delete('/:ruleId', authMiddleware, AlertController.deleteRule);

export default router;