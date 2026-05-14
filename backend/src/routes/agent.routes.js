import express from 'express';
import AgentController from '../controllers/agent.controller.js';

const router = express.Router();

// Multi-Agent Study Assistant endpoints
router.post('/analyze-student', AgentController.analyzeStudent);
router.post('/create-roadmap', AgentController.createRoadmap);
router.post('/find-resources', AgentController.findResources);
router.post('/generate-quiz', AgentController.generateQuiz);

export default router;
