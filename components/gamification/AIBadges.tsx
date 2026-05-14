import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldAlert, Zap, Target, Brain, Sparkles } from 'lucide-react';

const BADGES = [
    { id: 'b1', name: 'Firewall Breaker', icon: ShieldAlert, color: 'red', desc: 'Detected 50+ vulnerabilities in simulations.' },
    { id: 'b2', name: 'Neural Nomad', icon: Brain, color: 'blue', desc: 'Explored 10+ AI learning modules.' },
    { id: 'b3', name: 'Consistent Catalyst', icon: Zap, color: 'orange', desc: 'Maintained a 7-day learning streak.' },
    { id: 'b4', name: 'Precision Pupil', icon: Target, color: 'emerald', desc: 'Achieved 95%+ accuracy in 3 consecutive quizzes.' },
];

export const AIBadges: React.FC = () => {
    return (
        <div className="space-y-6">
            <h4 className="text-white font-bold flex items-center gap-2">
                <Award size={18} className="text-yellow-400" />
                AI Achievements
            </h4>
            <div className="grid grid-cols-2 gap-4">
                {BADGES.map((badge, i) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl flex flex-col items-center text-center group hover:border-blue-500/30 transition-all"
                    >
                        <div className={`p-3 bg-${badge.color}-500/10 rounded-full text-${badge.color}-400 mb-3 group-hover:scale-110 transition-transform`}>
                            <badge.icon size={24} />
                        </div>
                        <h5 className="text-white text-xs font-bold mb-1">{badge.name}</h5>
                        <p className="text-[10px] text-slate-500 leading-tight">{badge.desc}</p>
                    </motion.div>
                ))}
            </div>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-center gap-3">
                <Sparkles size={16} className="text-yellow-500 shrink-0" />
                <p className="text-[10px] text-yellow-200/70">AI is analyzing your behavior to unlock the **"Cyber Sentinel"** badge.</p>
            </div>
        </div>
    );
};
