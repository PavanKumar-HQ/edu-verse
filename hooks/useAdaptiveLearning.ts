import { useState, useEffect, useCallback } from 'react';

interface TelemetryData {
    labId: string;
    sector: string;
    score: number;
    maxPossibleScore: number;
    timeSpentSeconds: number;
    retryCount: number;
    difficultyLevel: string;
}

export const useAdaptiveLearning = (userId?: string) => {
    const [currentDifficulty, setCurrentDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
    const [xp, setXp] = useState(0);
    const [recommendations, setRecommendations] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const resolvedUserId = userId || 'demo_student';

    /**
     * Sends telemetry data to the backend and updates the adaptive state.
     */
    const logProgress = useCallback(async (data: TelemetryData) => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/v1/progress/log', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: resolvedUserId, ...data })
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                setCurrentDifficulty(result.data.nextDifficulty);
                setXp(prev => prev + result.data.xpEarned);
                // In a real app, we might also update the global user context here
            }
        } catch (error) {
            console.error('Failed to log adaptive progress:', error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    /**
     * Fetches AI-generated learning insights.
     */
    const getLearningRoadmap = useCallback(async (interests: string) => {
        try {
            const response = await fetch('http://localhost:5001/api/v1/ai/roadmap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, interests })
            });
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Failed to fetch AI roadmap:', error);
            return null;
        }
    }, [userId]);

    return {
        currentDifficulty,
        xp,
        logProgress,
        getLearningRoadmap,
        isLoading
    };
};
