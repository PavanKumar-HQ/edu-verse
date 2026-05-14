import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Service to handle all AI-related logic using Google Gemini.
 */
class AIService {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }

    /**
     * Explains a concept based on the requested mode.
     */
    async explainConcept(topic, mode = 'Standard', context = '') {
        const prompts = {
            'ELI10': `Explain the concept of "${topic}" like I'm 10 years old. Use simple analogies and friendly language.`,
            'ExamPrep': `Provide a detailed, structured summary of "${topic}" for exam preparation. Include key definitions, bullet points, and likely exam questions.`,
            'Interview': `Explain "${topic}" from a technical interview perspective. Include how to explain it to a recruiter and common follow-up questions.`,
            'RealWorld': `Show me real-world practical applications and case studies of "${topic}" in the industry today.`,
            'Standard': `Provide a clear and comprehensive explanation of "${topic}".`
        };

        const prompt = `${prompts[mode] || prompts['Standard']} ${context ? `\n\nAdditional Context: ${context}` : ''}`;
        
        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('AI Explanation Error:', error);
            throw new Error('Failed to generate AI explanation');
        }
    }

    /**
     * Generates a dynamic quiz for a topic.
     */
    async generateQuiz(topic, difficulty = 'Beginner', count = 5) {
        const prompt = `Generate a JSON array of ${count} multiple-choice questions for the topic "${topic}" at a ${difficulty} level. 
        Each object should have: "question", "options" (array of 4), "correctIndex" (0-3), and "explanation".
        Return ONLY the raw JSON array.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text();
            
            // Clean the response if it contains markdown code blocks
            text = text.replace(/```json|```/gi, '').trim();
            
            return JSON.parse(text);
        } catch (error) {
            console.error('Quiz Generation Error:', error);
            throw new Error('Failed to generate AI quiz');
        }
    }

    /**
     * Suggests a personalized learning roadmap.
     */
    async generateRoadmap(masteryData, interests) {
        const prompt = `Based on a student's current mastery data: ${JSON.stringify(masteryData)} and interests: ${interests}, 
        generate a personalized learning roadmap. Suggest 3 next topics, explaining why they fit the current path and identifying any prerequisite gaps.
        Format as a professional educational advice.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Roadmap Generation Error:', error);
            throw new Error('Failed to generate learning roadmap');
        }
    }
}

export default new AIService();
