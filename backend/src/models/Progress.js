import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labId: { type: String, required: true },
    sector: { type: String, required: true },
    
    // Performance Metrics
    score: { type: Number, default: 0 },
    maxPossibleScore: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }, // score / max
    
    // Engagement Metrics
    timeSpentSeconds: { type: Number, default: 0 },
    retryCount: { type: Number, default: 0 },
    completionStatus: { type: String, enum: ['In-Progress', 'Completed', 'Dropped'], default: 'In-Progress' },
    
    // Adaptive Telemetry
    difficultyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    knowledgeGapsDetected: [String],
    
    // Timestamp for the session
    sessionDate: { type: Date, default: Date.now }

}, { timestamps: true });

export default mongoose.model('Progress', progressSchema);
