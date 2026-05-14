import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    
    // Gamification
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    badges: [{
        name: String,
        icon: String,
        awardedAt: { type: Date, default: Date.now }
    }],

    // Adaptive Learning Data
    learningStyle: { 
        type: String, 
        enum: ['Visual', 'Auditory', 'Reading', 'Kinesthetic', 'Unset'], 
        default: 'Unset' 
    },
    topicMastery: {
        type: Map,
        of: Number, // Percentage 0-100
        default: {}
    },
    knowledgeGaps: [String], // List of topics requiring attention
    
    // Preferences
    preferredTutorMode: { type: String, default: 'Standard' },
    isFocusModeEnabled: { type: Boolean, default: false }

}, { timestamps: true });

export default mongoose.model('User', userSchema);
