import User from '../models/User.js';
// In a real app, you would have a Course/Resource model
// For the MVP, we'll use the constants structure
import { COURSES, EDUCATIONAL_RESOURCES } from '../constants.js'; 

class RecommendationService {
    /**
     * Recommends content based on user mastery, interests, and gaps.
     */
    async getRecommendations(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('User not found');

            const recommendations = {
                nextBestLesson: [],
                smartRevision: [],
                trending: []
            };

            // 1. SMART REVISION: Topics with mastery < 60%
            user.topicMastery.forEach((score, topicId) => {
                if (score < 60) {
                    const resource = EDUCATIONAL_RESOURCES.find(r => r.id.includes(topicId) || r.category.toLowerCase().includes(topicId.toLowerCase()));
                    if (resource) recommendations.smartRevision.push({ ...resource, reason: 'Mastery Boost' });
                }
            });

            // 2. NEXT BEST LESSON: Based on interests and current level
            const userInterests = user.learningStyle; // Simplified for MVP
            COURSES.forEach(course => {
                if (!user.topicMastery.has(course.course_id)) {
                    recommendations.nextBestLesson.push({ ...course, reason: 'Curriculum Path' });
                }
            });

            // 3. TRENDING: Top 2 general resources
            recommendations.trending = EDUCATIONAL_RESOURCES.slice(0, 2);

            return recommendations;
        } catch (error) {
            console.error('Recommendation Error:', error);
            throw error;
        }
    }
}

export default new RecommendationService();
