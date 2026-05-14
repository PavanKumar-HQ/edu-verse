import AdaptiveService from '../services/adaptive.service.js';
import Progress from '../models/Progress.js';

/**
 * Controller to handle adaptive learning analytics and pacing.
 */
class AdaptiveController {
    async getAnalytics(req, res) {
        const { userId } = req.params;
        try {
            const history = await Progress.find({ userId });
            const totalScore = history.reduce((acc, curr) => acc + curr.score, 0);
            const totalTime = history.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);
            const recentScores = history.slice(-5).map(h => h.accuracy * 100);

            const efficiency = AdaptiveService.calculateEfficiency(totalScore, totalTime);
            const momentum = AdaptiveService.predictMomentum(recentScores);
            const risk = AdaptiveService.segmentAcademicRisk({
                attendance: 0.8, // Mock for now
                mastery: totalScore / (history.length * 100 || 1),
                engagement: 0.7 // Mock for now
            });

            res.json({
                status: 'success',
                data: { efficiency, momentum, risk, historyCount: history.length }
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getPacing(req, res) {
        const { mode, difficulty } = req.body;
        try {
            const pacing = AdaptiveService.adjustPacing(mode, difficulty);
            res.json({ status: 'success', data: pacing });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new AdaptiveController();
