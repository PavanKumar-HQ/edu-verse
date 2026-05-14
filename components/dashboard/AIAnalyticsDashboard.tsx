import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
    AreaChart, Area, BarChart, Bar
} from 'recharts';
import { TrendingUp, AlertTriangle, Target, Clock, Zap, Brain, Sparkles } from 'lucide-react';
import { SkillTree } from '../gamification/SkillTree';
import { AIBadges } from '../gamification/AIBadges';

const MOCK_DATA = {
    performance: [
        { name: 'Mon', score: 65, avg: 60 },
        { name: 'Tue', score: 72, avg: 61 },
        { name: 'Wed', score: 85, avg: 62 },
        { name: 'Thu', score: 78, avg: 63 },
        { name: 'Fri', score: 92, avg: 64 },
    ],
    mastery: [
        { subject: 'Cybersecurity', A: 120, fullMark: 150 },
        { subject: 'AI Ethics', A: 98, fullMark: 150 },
        { subject: 'Blockchain', A: 86, fullMark: 150 },
        { subject: 'Fintech', A: 99, fullMark: 150 },
        { subject: 'Soft Skills', A: 85, fullMark: 150 },
    ],
    risk: { level: 'Low', probability: 12, reason: 'High consistency and rising accuracy trends.' }
};

export const AIAnalyticsDashboard: React.FC<{ userId: string }> = ({ userId }) => {
    const [analyticsData, setAnalyticsData] = useState(MOCK_DATA);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // In a real app, fetch from http://localhost:5001/api/v1/progress/analytics/:userId
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, [userId]);

    if (isLoading) {
        return (
            <div className="h-96 flex items-center justify-center">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                    <Brain size={48} className="text-blue-500 opacity-50" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Header / Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                            <Target size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Overall Mastery</p>
                            <h3 className="text-2xl font-bold text-white">84%</h3>
                        </div>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }} animate={{ width: '84%' }}
                            className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                        />
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Learning Speed</p>
                            <h3 className="text-2xl font-bold text-white">1.2x Faster</h3>
                        </div>
                    </div>
                    <p className="text-xs text-slate-500">You are completing modules 20% faster than your average.</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-sm">Success Prediction</p>
                            <h3 className="text-2xl font-bold text-white">94.2%</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-400">
                        <AlertTriangle size={12} />
                        <span>Low risk of burnout detected.</span>
                    </div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Mastery Radar */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl h-[400px]">
                    <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                        <Brain size={18} className="text-blue-400" />
                        Skill Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.mastery}>
                            <PolarGrid stroke="#ffffff10" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                            <Radar
                                name="Mastery"
                                dataKey="A"
                                stroke="#3b82f6"
                                fill="#3b82f6"
                                fillOpacity={0.5}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>

                {/* Performance Trend */}
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl h-[400px]">
                    <h4 className="text-white font-semibold mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-emerald-400" />
                        Learning Consistency
                    </h4>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData.performance}>
                            <defs>
                                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#10b981" fillOpacity={1} fill="url(#colorScore)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Skill Tree - Gamification 2.0 */}
            <SkillTree />

            {/* AI Insights Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-blue-400 font-semibold mb-2">AI Learning Insights</h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                "You are currently excelling in **Cybersecurity Lab** simulations. However, we've detected a slight 
                                learning plateau in **Blockchain architecture**. We recommend a quick 5-minute refresher on 
                                *Consensus Algorithms* to break through. Your consistency is in the top 5% of users this week!"
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
                    <AIBadges />
                </div>
            </div>
        </div>
    );
};
