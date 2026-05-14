import React from 'react';
import { motion } from 'framer-motion';
import { 
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, 
    ResponsiveContainer 
} from 'recharts';
import { Brain, Zap, Target, Shield, Clock, Search } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const CognitiveRadar: React.FC = () => {
    const { radarStats } = useAppContext();

    // Determine dominant and needs focus dynamically
    const sortedStats = [...radarStats].sort((a, b) => b.A - a.A);
    const dominant = sortedStats[0]?.subject || 'None';
    const focus = sortedStats[sortedStats.length - 1]?.subject || 'None';

    return (
        <div className="bg-slate-950/40 backdrop-blur-3xl border border-white/5 rounded-[32px] p-8 h-full flex flex-col">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Search size={20} />
                    </div>
                    Cognitive Radar
                </h3>
                <p className="text-slate-400 text-xs mt-1">Real-time mental performance breakdown</p>
            </div>

            <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarStats}>
                        <PolarGrid stroke="#ffffff10" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                            name="Mastery"
                            dataKey="A"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                            fillOpacity={0.3}
                            animationBegin={500}
                            animationDuration={2000}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase mb-1">
                        <Zap size={12} /> Dominant
                    </div>
                    <div className="text-white font-bold">{dominant}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 text-orange-400 text-[10px] font-bold uppercase mb-1">
                        <Brain size={12} /> Needs Focus
                    </div>
                    <div className="text-white font-bold">{focus}</div>
                </div>
            </div>
        </div>
    );
};
