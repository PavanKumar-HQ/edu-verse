import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Service to handle all AI-related logic using Google Gemini.
 */
class AIService {
    constructor() {
        // Use 'gemini-2.5-flash' as primary for high performance and thinking capabilities
        const modelName = "gemini-2.5-flash";
        console.log(`[AIService] Initializing with model: ${modelName}`);
        this.model = genAI.getGenerativeModel({ model: modelName });
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

    /**
     * Compresses a long concept into a simplified micro-learning summary.
     */
    async compressConcept(topic, detail) {
        const prompt = `Compress the following detailed explanation of "${topic}" into a high-impact, simplified micro-learning summary. 
        Focus on the core "Aha!" moment. Use bullet points and keep it under 100 words.
        
        Detailed Content: ${detail}`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Concept Compression Error:', error);
            throw new Error('Failed to compress concept');
        }
    }

    /**
     * Translates technical concepts into relatable real-world analogies.
     */
    async translateToAnalogy(topic) {
        const prompt = `Create 3 highly relatable real-world analogies for the technical concept: "${topic}". 
        Make them creative and easy to visualize (e.g., "Blockchain is like a shared Google Doc ledger").`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Analogy Translation Error:', error);
            throw new Error('Failed to generate analogies');
        }
    }

    /**
     * Estimates if a student truly understood based on their responses.
     */
    async estimateUnderstanding(topic, studentResponse, previousInteraction) {
        const prompt = `As an expert tutor, analyze the following student response about "${topic}".
        Student said: "${studentResponse}"
        Previous context: "${previousInteraction}"
        
        Estimate their understanding level (0-100%). Identify if they are "hesitant", "confident but wrong", or "truly mastered".
        Provide a JSON response: { "score": number, "status": string, "reason": string }`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().replace(/```json|```/gi, '').trim();
            return JSON.parse(text);
        } catch (error) {
            return { score: 50, status: 'uncertain', reason: 'Analysis failed' };
        }
    }

    /**
     * Provides guided hints instead of direct answers.
     */
    async generateGuidedHints(topic, question, studentCurrentThought) {
        const prompt = `The student is struggling with this question on "${topic}": "${question}".
        Their current thinking: "${studentCurrentThought}"
        
        Do NOT give the answer. Instead, provide 2-3 leading questions or hints that encourage critical thinking and help them reach the conclusion themselves.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            throw new Error('Failed to generate hints');
        }
    }

    /**
     * Detects false understanding or memorized-only patterns.
     */
    async detectMisconceptions(topic, studentExplanation) {
        const prompt = `Analyze this student explanation for "${topic}": "${studentExplanation}".
        Check for common misconceptions, oversimplifications that are technically wrong, or signs of rote memorization without deep understanding.
        Provide a correction strategy.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            throw new Error('Failed to detect misconceptions');
        }
    }

    /**
     * Multi-mode Deep Tutor chat with session context.
     */
    async deepTutorChat(message, mode = 'Standard', history = []) {
        const modePersonas = {
            'Standard': `You are ASTRA, an expert AI tutor. Provide clear, comprehensive explanations.`,
            'ELI10': `You are a friendly tutor explaining to a 10-year-old. Use simple words, fun analogies, and emojis. Keep it engaging!`,
            'ExamPrep': `You are an exam coach. Provide structured bullet-point answers with definitions, key facts, and likely exam questions. Use headers.`,
            'Interview': `You are a tech interview coach. Explain concepts as you would to a recruiter: concisely, with STAR examples and follow-up interview questions.`,
            'RealWorld': `You are an industry expert. Show only real-world applications, case studies, and practical examples of this concept in modern industry.`,
            'DeepSolve': `You are a rigorous academic tutor. Break down the problem step-by-step, cite reasoning, verify each step, then summarize.`
        };

        const historyText = history.slice(-6).map(h => `${h.role}: ${h.content}`).join('\n');
        const systemPrompt = modePersonas[mode] || modePersonas['Standard'];
        const fullPrompt = `${systemPrompt}\n\nConversation History:\n${historyText}\n\nStudent: ${message}\n\nASTRA:`;

        try {
            const result = await this.model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('DeepTutor Chat Error:', error);
            throw new Error('Failed to process deep tutor chat');
        }
    }

    /**
     * Agent 1: Student Analyzer — profiles the student's learning needs.
     */
    async analyzeStudentProfile(topic, knowledgeLevel, learningGoal, timeAvailable, learningStyle) {
        const prompt = `You are an expert Educational AI Agent specializing in student learning analysis.

Student Profile:
- Topic: ${topic}
- Current Level: ${knowledgeLevel}
- Goal: ${learningGoal}
- Time Available: ${timeAvailable}
- Learning Style: ${learningStyle}

Provide a comprehensive learning analysis in markdown format:
1. **Knowledge Gap Assessment** — What they need to learn and prerequisites
2. **Recommended Approach** — Best strategy given their style and time
3. **Risk Factors** — Potential challenges and how to overcome them
4. **Success Metrics** — How they'll know they've achieved their goal

Be specific, actionable, and encouraging.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Student Analysis Error:', error);
            throw new Error('Failed to analyze student profile');
        }
    }

    /**
     * Agent 2: Roadmap Creator — builds a personalized study roadmap.
     */
    async createLearningRoadmap(analysis, topic, knowledgeLevel, timeAvailable, learningStyle) {
        const prompt = `You are an expert Learning Roadmap Creator AI Agent.

Based on this student analysis:
${analysis}

Create a detailed, personalized learning roadmap for:
- Topic: ${topic}
- Level: ${knowledgeLevel}
- Time: ${timeAvailable}
- Style: ${learningStyle}

Format the roadmap in markdown with:
## Phase 1: Foundation (Week 1-2)
- Key concepts with milestones
- Daily/weekly tasks
- Checkpoint quiz topics

## Phase 2: Development (Week 3-4)
...

## Phase 3: Mastery (Week 5+)
...

## Quick Wins (Day 1)
List 3 things they can accomplish TODAY to build momentum.

Make it motivating, structured, and achievable.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Roadmap Creation Error:', error);
            throw new Error('Failed to create learning roadmap');
        }
    }

    /**
     * Agent 3: Resource Finder — curates the best learning resources.
     */
    async findLearningResources(topic, learningStyle, knowledgeLevel) {
        const styleResourceMap = {
            'visual': 'videos, diagrams, infographics, mind maps',
            'auditory': 'podcasts, audio lectures, discussion forums',
            'kinesthetic': 'interactive platforms, coding exercises, hands-on projects',
            'reading_writing': 'textbooks, documentation, written tutorials, articles',
            'mixed': 'a combination of videos, articles, and interactive exercises'
        };
        const preferredFormats = styleResourceMap[learningStyle] || styleResourceMap['mixed'];

        const prompt = `You are a Learning Resource Curator AI Agent with knowledge of top educational platforms.

Find the best learning resources for:
- Topic: ${topic}
- Level: ${knowledgeLevel}
- Preferred formats: ${preferredFormats}

Provide resources in markdown:
## Free Resources
- Resource name, platform, URL (use real well-known platforms like Coursera, freeCodeCamp, Khan Academy, YouTube, MDN, etc.)

## Paid/Premium Resources
- Recommend 2-3 premium options with pricing notes

## Practice Platforms
- Where to apply the knowledge (LeetCode, Kaggle, GitHub, etc.)

## Communities
- Reddit, Discord, forums for the topic

Be specific with real resource names. Do not make up URLs.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Resource Finding Error:', error);
            throw new Error('Failed to find learning resources');
        }
    }

    /**
     * Agent 4: Quiz Generator — creates adaptive quizzes.
     */
    async generateStudyQuiz(topic, difficulty = 'intermediate', count = 10, focusAreas = 'general') {
        const prompt = `Generate a JSON array of ${count} multiple-choice quiz questions on "${topic}" (focus: ${focusAreas}) at ${difficulty} level.

Each object must have:
- "question": string
- "options": array of 4 strings
- "correctIndex": number (0-3)
- "explanation": string (why the answer is correct)
- "difficulty": "${difficulty}"

Vary the question types: conceptual understanding, application, common mistakes, edge cases.
Return ONLY the raw JSON array, no markdown.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().replace(/```json|```/gi, '').trim();
            // Find the JSON array in the response
            const startIdx = text.indexOf('[');
            const endIdx = text.lastIndexOf(']');
            if (startIdx !== -1 && endIdx !== -1) {
                text = text.substring(startIdx, endIdx + 1);
            }
            return JSON.parse(text);
        } catch (error) {
            console.error('Study Quiz Generation Error:', error);
            throw new Error('Failed to generate study quiz');
        }
    }

    /**
     * Holo-Mentor Avatar chat — returns response with expression and animation metadata.
     */
    async avatarChat(message, persona = 'Mentor', history = []) {
        const personas = {
            'Mentor': 'a wise, encouraging mentor who motivates students and celebrates their progress',
            'Peer Tutor': 'a friendly peer student who uses casual language and relatable examples',
            'Strict Professor': 'a rigorous professor who pushes students to think critically and deeply',
            'Friendly Coach': 'an enthusiastic learning coach who uses energy and positive reinforcement'
        };
        const historyText = history.slice(-4).map(h => `${h.role}: ${h.content}`).join('\n');
        const prompt = `You are ASTRA, an AI tutor avatar acting as ${personas[persona] || personas['Mentor']}.

Recent conversation:
${historyText}

Student says: "${message}"

Respond naturally (2-3 sentences max). Then return ONLY this exact JSON:
{
  "text": "your response here",
  "facialExpression": "one of: smile, sad, angry, surprised, thinking, default",
  "animation": "one of: Idle, TalkingOne, TalkingThree, Explaining, Encouraging, ThoughtfulHeadShake",
  "mood": "one of: happy, neutral, excited, concerned, proud"
}

Choose expressions and animations that match the emotional context of your response.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            let text = response.text().replace(/```json|```/gi, '').trim();
            const startIdx = text.indexOf('{');
            const endIdx = text.lastIndexOf('}');
            if (startIdx !== -1 && endIdx !== -1) {
                return JSON.parse(text.substring(startIdx, endIdx + 1));
            }
            return { text: text, facialExpression: 'smile', animation: 'TalkingOne', mood: 'happy' };
        } catch (error) {
            console.error('Avatar Chat Error:', error);
            return { text: 'I\'m here to help! What would you like to learn?', facialExpression: 'smile', animation: 'Idle', mood: 'happy' };
        }
    }
}

export default new AIService();
