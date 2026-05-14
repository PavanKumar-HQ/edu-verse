import AIService from '../services/ai.service.js';
import User from '../models/User.js';

/**
 * Controller to handle AI tutoring and content requests.
 */
class AIController {
    async getExplanation(req, res) {
        const { topic, mode, context } = req.body;
        try {
            const explanation = await AIService.explainConcept(topic, mode, context);
            res.json({ status: 'success', data: explanation });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getQuiz(req, res) {
        const { topic, difficulty, count } = req.body;
        try {
            const quiz = await AIService.generateQuiz(topic, difficulty, count);
            res.json({ status: 'success', data: quiz });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getRoadmap(req, res) {
        const { userId, interests } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
            
            const roadmap = await AIService.generateRoadmap(user.topicMastery, interests);
            res.json({ status: 'success', data: roadmap });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new AIController();
