import express from 'express';
import ProgressController from '../controllers/progress.controller.js';

const router = express.Router();

router.post('/log', ProgressController.logProgress);
router.get('/analytics/:userId', ProgressController.getAnalytics);

export default router;
