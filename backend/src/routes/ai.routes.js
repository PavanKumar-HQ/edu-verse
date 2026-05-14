import express from 'express';
import AIController from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/explain', AIController.getExplanation);
router.post('/quiz', AIController.getQuiz);
router.post('/roadmap', AIController.getRoadmap);
router.post('/compress', AIController.compressConcept);
router.post('/analogies', AIController.getAnalogies);
router.post('/estimate-understanding', AIController.estimateUnderstanding);
router.post('/hints', AIController.getHints);
router.post('/detect-misconceptions', AIController.detectMisconceptions);
router.post('/deep-tutor/chat', AIController.deepTutorChat);
router.post('/avatar/chat', AIController.avatarChat);

export default router;
