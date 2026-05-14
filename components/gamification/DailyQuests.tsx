import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Circle, Flame, Trophy, Star, Sparkles } from 'lucide-react';

interface Quest {
    id: string;
    title: string;
    xp: number;
    completed: boolean;
    progress: number;
    total: number;
}

export const DailyQuests: React.FC = () => {
    const [quests, setQuests] = useState<Quest[]>([
        { id: '1', title: 'Curious Learner: Ask the AI Tutor 3 questions', xp: 50, completed: false, progress: 1, total: 3 },
        { id: '2', title: 'Security Pro: Complete the Ransomware Lab', xp: 150, completed: true, progress: 1, total: 1 },
        { id: '3', title: 'Flash Master: Review 5 AI Flashcards', xp: 75, completed: false, progress: 2, total: 5 },
    ]);

    const totalXP = quests.filter(q => q.completed).reduce((acc, curr) => acc + curr.xp, 0);

    return (
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-700" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-orange-500/20 rounded-2xl text-orange-400">
                        <Flame size={22} className="animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Daily Quests</h3>
                        <p className="text-slate-400 text-sm">Boost your XP with AI-generated challenges</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-lg">
                        <Trophy size={18} /> {totalXP} XP
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Today's Progress</span>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                {quests.map((quest, i) => (
                    <motion.div
                        key={quest.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between ${
                            quest.completed 
                            ? 'bg-emerald-500/10 border-emerald-500/20' 
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                        }`}
                    >
                        <div className="flex items-center gap-4 flex-1">
                            <div className={`shrink-0 ${quest.completed ? 'text-emerald-400' : 'text-slate-600'}`}>
                                {quest.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </div>
                            <div className="flex-1">
                                <h4 className={`text-sm font-bold ${quest.completed ? 'text-slate-300 line-through' : 'text-white'}`}>
                                    {quest.title}
                                </h4>
                                <div className="mt-2 flex items-center gap-3">
                                    <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(quest.progress / quest.total) * 100}%` }}
                                            className={`h-full ${quest.completed ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                        />
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">{quest.progress}/{quest.total}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`ml-6 px-3 py-1 rounded-full text-[10px] font-bold border ${
                            quest.completed 
                            ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' 
                            : 'bg-white/10 border-white/10 text-slate-400'
                        }`}>
                            +{quest.xp} XP
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl text-slate-400 hover:text-white text-sm font-bold transition-all flex items-center justify-center gap-2 group">
                <Sparkles size={16} className="group-hover:text-blue-400" />
                Regenerate for 50 XP
            </button>
        </div>
    );
};
