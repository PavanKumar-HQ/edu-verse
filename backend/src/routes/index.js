import express from 'express';
import aiRoutes from './ai.routes.js';
import progressRoutes from './progress.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import adaptiveRoutes from './adaptive.routes.js';
import agentRoutes from './agent.routes.js';

const router = express.Router();

router.use('/ai', aiRoutes);
router.use('/progress', progressRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/adaptive', adaptiveRoutes);
router.use('/agent', agentRoutes);

router.get('/health', (req, res) => {
    res.json({ status: 'success', message: 'Geniusphere API is healthy' });
});

export default router;
