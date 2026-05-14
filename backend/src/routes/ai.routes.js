import express from 'express';
import AIController from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/explain', AIController.getExplanation);
router.post('/quiz', AIController.getQuiz);
router.post('/roadmap', AIController.getRoadmap);

export default router;
