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
    async compressConcept(req, res) {
        const { topic, detail } = req.body;
        try {
            const summary = await AIService.compressConcept(topic, detail);
            res.json({ status: 'success', data: summary });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getAnalogies(req, res) {
        const { topic } = req.body;
        try {
            const analogies = await AIService.translateToAnalogy(topic);
            res.json({ status: 'success', data: analogies });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async estimateUnderstanding(req, res) {
        const { topic, studentResponse, previousInteraction } = req.body;
        try {
            const result = await AIService.estimateUnderstanding(topic, studentResponse, previousInteraction);
            res.json({ status: 'success', data: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getHints(req, res) {
        const { topic, question, studentCurrentThought } = req.body;
        try {
            const hints = await AIService.generateGuidedHints(topic, question, studentCurrentThought);
            res.json({ status: 'success', data: hints });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async detectMisconceptions(req, res) {
        const { topic, studentExplanation } = req.body;
        try {
            const result = await AIService.detectMisconceptions(topic, studentExplanation);
            res.json({ status: 'success', data: result });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async deepTutorChat(req, res) {
        const { message, mode, history } = req.body;
        if (!message) return res.status(400).json({ status: 'error', message: 'message is required' });
        try {
            const response = await AIService.deepTutorChat(message, mode || 'Standard', history || []);
            res.json({ status: 'success', data: { response, mode: mode || 'Standard' } });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async avatarChat(req, res) {
        const { message, persona, history } = req.body;
        if (!message) return res.status(400).json({ status: 'error', message: 'message is required' });
        try {
            const response = await AIService.avatarChat(message, persona || 'Mentor', history || []);
            res.json({ status: 'success', data: response });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new AIController();
