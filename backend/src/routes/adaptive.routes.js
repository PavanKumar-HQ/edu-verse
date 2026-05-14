import express from 'express';
import AdaptiveController from '../controllers/adaptive.controller.js';

const router = express.Router();

router.get('/analytics/:userId', AdaptiveController.getAnalytics);
router.post('/pacing', AdaptiveController.getPacing);

export default router;
