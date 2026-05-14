import mongoose from 'mongoose';

const aiInteractionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    context: {
        topic: String,
        labId: String,
        currentDifficulty: String
    },
    messages: [{
        role: { type: String, enum: ['user', 'assistant', 'system'] },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    mode: { 
        type: String, 
        enum: ['ELI10', 'ExamPrep', 'Interview', 'RealWorld', 'QuizMe', 'Standard'], 
        default: 'Standard' 
    },
    tokensUsed: { type: Number, default: 0 }

}, { timestamps: true });

export default mongoose.model('AIInteraction', aiInteractionSchema);
