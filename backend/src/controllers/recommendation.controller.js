import recommendationService from '../services/recommendation.service.js';

export const getRecommendations = async (req, res) => {
    try {
        const { userId } = req.params;
        const recommendations = await recommendationService.getRecommendations(userId);
        res.status(200).json({
            success: true,
            data: recommendations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching recommendations',
            error: error.message
        });
    }
};
