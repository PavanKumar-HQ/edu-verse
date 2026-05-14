import Progress from '../models/Progress.js';
import User from '../models/User.js';
import AdaptiveService from '../services/adaptive.service.js';

class ProgressController {
    /**
     * Records a new telemetry log and calculates adaptive adjustments.
     */
    async logProgress(req, res) {
        const { userId, labId, sector, score, maxPossibleScore, timeSpentSeconds, retryCount, difficultyLevel } = req.body;
        
        try {
            const accuracy = score / maxPossibleScore;
            
            // 1. Create Progress Log
            const progress = new Progress({
                userId, labId, sector, score, maxPossibleScore, accuracy, timeSpentSeconds, retryCount, difficultyLevel
            });
            await progress.save();

            // 2. Run Adaptive Logic
            const nextDifficulty = AdaptiveService.calculateDifficulty(difficultyLevel, accuracy, timeSpentSeconds, retryCount);
            
            // 3. Update User Mastery & Profiles
            const user = await User.findById(userId);
            if (user) {
                // Update XP
                user.xp += (score * 10);
                
                // Update topic mastery (simple moving average for demo)
                const currentMastery = user.topicMastery.get(labId) || 0;
                const newMastery = (currentMastery + (accuracy * 100)) / 2;
                user.topicMastery.set(labId, newMastery);
                
                await user.save();
            }

            res.json({ 
                status: 'success', 
                data: { 
                    nextDifficulty,
                    xpEarned: score * 10,
                    masteryIncrease: accuracy * 100
                } 
            });

        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }

    async getAnalytics(req, res) {
        const { userId } = req.params;
        try {
            const history = await Progress.find({ userId }).sort({ createdAt: -1 }).limit(20);
            const user = await User.findById(userId);
            
            const risk = AdaptiveService.predictPerformanceRisk(0.8, 0.7, 0.9); // Dummy inputs for now
            
            res.json({ 
                status: 'success', 
                data: {
                    history,
                    topicMastery: user?.topicMastery,
                    riskPrediction: risk
                } 
            });
        } catch (error) {
            res.status(500).json({ status: 'error', message: error.message });
        }
    }
}

export default new ProgressController();
