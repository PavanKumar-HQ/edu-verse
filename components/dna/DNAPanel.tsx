import React from 'react';
import { motion } from 'framer-motion';
import { DNASphere } from './DNASphere';
import { Fingerprint, Activity, Zap, Brain, Target, ShieldCheck } from 'lucide-react';

export const DNAPanel: React.FC = () => {
    return (
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 relative overflow-hidden group">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
                {/* Left: Animated Orb */}
                <div className="w-full lg:w-1/2">
                    <DNASphere />
                </div>

                {/* Right: Metrics & Scanner */}
                <div className="w-full lg:w-1/2 space-y-8">
                    <div>
                        <h3 className="text-3xl font-bold text-white flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-2xl text-blue-400">
                                <Fingerprint size={28} />
                            </div>
                            AI Learning DNA
                        </h3>
                        <p className="text-slate-400 mt-2 text-sm leading-relaxed">
                            Your biometric learning profile is generated uniquely based on simulation behavior, 
                            logic patterns, and retention metrics.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Learning Velocity', value: '4.8x', icon: Zap, color: 'text-yellow-400', bar: 85 },
                            { label: 'Retention Rate', value: '92%', icon: Brain, color: 'text-blue-400', bar: 92 },
                            { label: 'Quiz Stability', value: 'High', icon: Target, color: 'text-red-400', bar: 78 },
                            { label: 'Cyber Instinct', value: 'Expert', icon: ShieldCheck, color: 'text-emerald-400', bar: 95 },
                        ].map((stat, i) => (
                            <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className={`p-2 rounded-xl bg-slate-900/50 ${stat.color}`}>
                                        <stat.icon size={16} />
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.label}</span>
                                </div>
                                <div className="flex items-end justify-between gap-4">
                                    <span className="text-xl font-bold text-white">{stat.value}</span>
                                    <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden mb-1.5">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.bar}%` }}
                                            transition={{ duration: 1.5, delay: i * 0.1 }}
                                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin flex items-center justify-center">
                                <Activity size={20} className="text-blue-400" />
                            </div>
                            <div>
                                <h4 className="text-blue-400 font-bold text-sm">System Adapting...</h4>
                                <p className="text-[10px] text-slate-400">Optimizing UI for "Visual Learner" preference</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all">
                            Scan Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
