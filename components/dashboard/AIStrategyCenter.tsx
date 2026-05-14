import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Target, AlertTriangle, Zap, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { adaptiveService } from '../../services/api';

export const AIStrategyCenter: React.FC = () => {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const userId = "demo_user_123"; // In a real app, get from auth context

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                // Use adaptiveService instead of progressService
                const result = await adaptiveService.getAnalytics(userId);
                if (result.status === 'success') {
                    setAnalytics(result.data);
                }
            } catch (error) {
                console.error('Failed to fetch AI analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-400">
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="font-mono text-sm animate-pulse">SYNCHRONIZING AI ANALYTICS...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-blue-400" size={24} /> AI Strategy Center
                    </h3>
                    <p className="text-slate-400 text-sm">Adaptive learning orchestration and behavior analytics</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live Feed</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Error Pattern Intelligence */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem]"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
                            <AlertTriangle size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-white">Error Pattern Intelligence</h4>
                    </div>
                    
                    <div className="space-y-4">
                        {[
                            { type: 'Conceptual Misunderstanding', count: 42, color: 'text-red-400', bar: 'bg-red-500' },
                            { type: 'Careless Errors (Fast Pacing)', count: 28, color: 'text-orange-400', bar: 'bg-orange-500' },
                            { type: 'Time-Pressure Anxiety', count: 15, color: 'text-amber-400', bar: 'bg-amber-500' },
                        ].map((pattern) => (
                            <div key={pattern.type} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="text-slate-400">{pattern.type}</span>
                                    <span className={pattern.color}>{pattern.count}% of failures</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pattern.count}%` }}
                                        className={`h-full ${pattern.bar}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 text-xs text-slate-400 leading-relaxed">
                        <span className="text-blue-400 font-bold">AI Recommendation:</span> {analytics?.riskPrediction?.explanation || "Maintain current study pace. No critical risks detected."}
                    </div>
                </motion.div>

                {/* Revision Priority Engine */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem]"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                            <Target size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-white">Revision Priority Engine</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(analytics?.topicMastery || {
                            'SQL Injection': 98,
                            'Zero Trust': 82,
                            'Neural Nets': 54,
                            'Cloud Storage': 21
                        }).slice(0, 4).map(([topic, mastery]: [any, any]) => (
                            <div key={topic} className="p-3 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-bold truncate">{topic.replace('sim_', '')}</p>
                                <div className="flex items-end justify-between mt-1">
                                    <p className="text-sm font-bold text-white">{mastery > 80 ? 'Mastered' : mastery > 50 ? 'Developing' : 'Critical'}</p>
                                    <p className="text-xs font-mono text-purple-400">{Math.round(mastery)}%</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-[10px] text-slate-500 font-mono text-center">
                        WEIGHTS UPDATED: <span className="text-emerald-400">SYNCED LIVE</span>
                    </p>
                </motion.div>

                {/* Efficiency Score */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem]"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                                <Zap size={20} />
                            </div>
                            <h4 className="text-lg font-bold text-white">Learning Efficiency</h4>
                        </div>
                        <span className="text-2xl font-extrabold text-white">{(analytics?.history?.length * 12.4 || 82.4).toFixed(1)}</span>
                    </div>
                    
                    <div className="h-40 flex items-end gap-2 px-2">
                        {(analytics?.history?.map((h: any) => h.accuracy * 100) || [40, 65, 45, 80, 75, 90, 82]).slice(-7).map((h: number, i: number) => (
                            <motion.div 
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(10, h)}%` }}
                                className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-400 rounded-t-lg"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 px-2 text-[10px] text-slate-500 font-bold uppercase">
                        <span>Sessions</span>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Recent Performance</span>
                        </div>
                    </div>
                </motion.div>

                {/* Momentum Hub */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem]"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                            <TrendingUp size={20} />
                        </div>
                        <h4 className="text-lg font-bold text-white">Learning Momentum</h4>
                    </div>
                    
                    <div className="flex items-center justify-center py-4">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-white/5 border-t-blue-500 animate-[spin_3s_linear_infinite]" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-extrabold text-white">{(analytics?.history?.length / 5 + 1).toFixed(1)}x</span>
                                <span className="text-[10px] text-blue-400 font-bold uppercase">Velocity</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs text-slate-400 mt-4 italic px-4">
                        "Your momentum is **{analytics?.history?.length > 5 ? 'Accelerating' : 'Stable'}**. Predicted mastery of tracks reached {analytics?.history?.length} days early."
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
