/**
 * Service to handle adaptive learning logic and difficulty balancing.
 */
class AdaptiveService {
    /**
     * Calculates the new difficulty level based on performance history.
     */
    calculateDifficulty(currentDifficulty, accuracy, timeSpent, retryCount) {
        const levels = ['Beginner', 'Intermediate', 'Advanced'];
        let index = levels.indexOf(currentDifficulty);

        // Logic for scaling UP
        if (accuracy > 0.85 && retryCount <= 1) {
            index = Math.min(index + 1, levels.length - 1);
        }
        
        // Logic for scaling DOWN
        if (accuracy < 0.40 || (accuracy < 0.60 && retryCount > 3)) {
            index = Math.max(index - 1, 0);
        }

        return levels[index];
    }

    /**
     * Identifies knowledge gaps based on quiz results and engagement.
     */
    detectKnowledgeGaps(performanceLogs) {
        const gaps = [];
        // Group by topic and find low accuracy areas
        const topicStats = {};

        performanceLogs.forEach(log => {
            if (!topicStats[log.topic]) {
                topicStats[log.topic] = { total: 0, correct: 0 };
            }
            topicStats[log.topic].total++;
            if (log.isCorrect) topicStats[log.topic].correct++;
        });

        for (const [topic, stats] of Object.entries(topicStats)) {
            if ((stats.correct / stats.total) < 0.6) {
                gaps.push(topic);
            }
        }

        return gaps;
    }

    /**
     * Predicts performance risk (Burnout or Failure probability).
     */
    predictPerformanceRisk(attendanceRate, averageScore, consistencyScore) {
        // High-level rule-based prediction (can be replaced by ML model)
        let risk = 'Low';
        let probability = 0.1;

        if (attendanceRate < 0.5 || averageScore < 0.4) {
            risk = 'High';
            probability = 0.8;
        } else if (attendanceRate < 0.7 || averageScore < 0.6 || consistencyScore < 0.5) {
            risk = 'Medium';
            probability = 0.4;
        }

        return { risk, probability };
    }
}

export default new AdaptiveService();
