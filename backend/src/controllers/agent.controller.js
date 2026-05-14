import AIService from '../services/ai.service.js';

/**
 * Controller for multi-agent study assistant endpoints.
 */
class AgentController {
    /**
     * Agent 1: Analyze student profile and learning needs.
     */
    async analyzeStudent(req, res) {
        try {
            const { topic, knowledgeLevel, learningGoal, timeAvailable, learningStyle } = req.body;
            if (!topic || !knowledgeLevel) {
                return res.status(400).json({ status: 'error', message: 'topic and knowledgeLevel are required' });
            }
            const analysis = await AIService.analyzeStudentProfile(
                topic,
                knowledgeLevel || 'beginner',
                learningGoal || 'Learn the fundamentals',
                timeAvailable || '3-5 hours per week',
                learningStyle || 'mixed'
            );
            res.json({ status: 'success', data: { analysis } });
        } catch (error) {
            console.error('Analyze Student Error:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * Agent 2: Create personalized learning roadmap.
     */
    async createRoadmap(req, res) {
        try {
            const { analysis, topic, knowledgeLevel, timeAvailable, learningStyle } = req.body;
            if (!topic) {
                return res.status(400).json({ status: 'error', message: 'topic is required' });
            }
            const roadmap = await AIService.createLearningRoadmap(
                analysis || '',
                topic,
                knowledgeLevel || 'beginner',
                timeAvailable || '3-5 hours per week',
                learningStyle || 'mixed'
            );
            res.json({ status: 'success', data: { roadmap } });
        } catch (error) {
            console.error('Create Roadmap Error:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * Agent 3: Find curated learning resources.
     */
    async findResources(req, res) {
        try {
            const { topic, learningStyle, knowledgeLevel } = req.body;
            if (!topic) {
                return res.status(400).json({ status: 'error', message: 'topic is required' });
            }
            const resources = await AIService.findLearningResources(
                topic,
                learningStyle || 'mixed',
                knowledgeLevel || 'beginner'
            );
            res.json({ status: 'success', data: { resources } });
        } catch (error) {
            console.error('Find Resources Error:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    /**
     * Agent 4: Generate adaptive quiz.
     */
    async generateQuiz(req, res) {
        try {
            const { topic, difficulty, count, focusAreas } = req.body;
            if (!topic) {
                return res.status(400).json({ status: 'error', message: 'topic is required' });
            }
            const questions = await AIService.generateStudyQuiz(
                topic,
                difficulty || 'intermediate',
                parseInt(count) || 10,
                focusAreas || 'general'
            );
            res.json({ status: 'success', data: { questions } });
        } catch (error) {
            console.error('Generate Quiz Error:', error);
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new AgentController();
