import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, AlertCircle, TrendingDown, BookOpen, MessageSquare, ChevronRight, Filter, Search, Brain, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const MOCK_STUDENTS = [
    { id: '1', name: 'Alex Rivera', risk: 'High', prob: 82, gap: 'SQL Injection', status: 'At Risk', activity: '3 days ago', style: 'Kinesthetic' },
    { id: '2', name: 'Sarah Chen', risk: 'Medium', prob: 45, gap: 'Blockchain PoW', status: 'Slowing Down', activity: '1 day ago', style: 'Visual' },
    { id: '3', name: 'Marcus Thorne', risk: 'Low', prob: 12, gap: 'None', status: 'Excelling', activity: '2 hours ago', style: 'Theoretical' },
    { id: '4', name: 'Elena Vance', risk: 'High', prob: 76, gap: 'Network Scanning', status: 'Struggling', activity: '5 days ago', style: 'Visual' },
];

const STYLE_DIST = [
  { name: 'Visual', value: 45, color: '#3b82f6' },
  { name: 'Theoretical', value: 25, color: '#8b5cf6' },
  { name: 'Kinesthetic', value: 30, color: '#10b981' },
];

import { adaptiveService } from '../../services/api';

export const TeacherDashboard: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [students, setStudents] = useState(MOCK_STUDENTS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const updatedStudents = await Promise.all(MOCK_STUDENTS.map(async (s) => {
                    try {
                        const res = await adaptiveService.getAnalytics(s.id);
                        if (res.status === 'success' && res.data?.risk) {
                            return { 
                                ...s, 
                                risk: res.data.risk.split(' ')[0], 
                                prob: (res.data.probability * 100) || s.prob 
                            };
                        }
                    } catch (err) {
                        console.warn(`Failed to fetch analytics for student ${s.id}:`, err);
                    }
                    return s;
                }));
                setStudents(updatedStudents);
            } catch (error) {
                console.error('Failed to fetch students:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    if (isLoading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <div className="relative">
                    <div className="w-12 h-12 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                    <Brain className="absolute inset-0 m-auto text-purple-400 animate-pulse" size={20} />
                </div>
                <p className="font-mono text-xs tracking-widest uppercase animate-pulse">Syncing_Teacher_Intelligence...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Students', value: '142', icon: Users, color: 'blue' },
                    { label: 'At Risk', value: '12', icon: AlertCircle, color: 'red' },
                    { label: 'Avg. Mastery', value: '74%', icon: BookOpen, color: 'emerald' },
                    { label: 'Active Today', value: '89', icon: TrendingDown, color: 'purple' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl"
                    >
                        <div className={`p-3 rounded-2xl w-fit mb-4 ${
                            stat.color === 'blue' ? 'bg-blue-500/10 text-blue-400' :
                            stat.color === 'red' ? 'bg-red-500/10 text-red-400' :
                            stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' :
                            'bg-purple-500/10 text-purple-400'
                        }`}>
                            <stat.icon size={24} />
                        </div>
                        <p className="text-slate-400 text-sm">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>
            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-cyan-400" /> Class Progress Velocity
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Weekly Growth', value: '+14%', color: 'text-emerald-400' },
                    { label: 'Avg Study Time', value: '52m', color: 'text-blue-400' },
                    { label: 'Burnout Risk', value: 'Low', color: 'text-emerald-400' },
                    { label: 'Gap Closure', value: '68%', color: 'text-purple-400' },
                  ].map(s => (
                    <div key={s.label} className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{s.label}</p>
                      <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-8">
                  <h5 className="text-xs text-slate-400 font-bold uppercase mb-4">Top Struggle Topics</h5>
                  <div className="space-y-3">
                    {['Network Security (42 students)', 'Cryptography Basics (28 students)', 'Social Engineering (12 students)'].map(t => (
                      <div key={t} className="flex items-center justify-between">
                        <span className="text-sm text-slate-300">{t}</span>
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500/50" style={{ width: t.includes('42') ? '80%' : '40%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                  <Brain size={18} className="text-purple-400" /> Learning Style Mix
                </h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={STYLE_DIST} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                        {STYLE_DIST.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {STYLE_DIST.map(s => (
                    <div key={s.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                        <span className="text-slate-400">{s.name}</span>
                      </div>
                      <span className="text-white font-bold">{s.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Risk Alerts Table */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <AlertCircle className="text-red-400" size={20} />
                            Student Intervention Alerts
                        </h3>
                        <p className="text-slate-400 text-sm mt-1">AI-predicted students requiring immediate support</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search students..."
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-blue-500 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] text-slate-500 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-bold">Student</th>
                                <th className="px-6 py-4 font-bold">Risk Level</th>
                                <th className="px-6 py-4 font-bold">Critical Gap</th>
                                <th className="px-6 py-4 font-bold">Probability</th>
                                <th className="px-6 py-4 font-bold">Last Active</th>
                                <th className="px-6 py-4 font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {students.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student) => (
                                <tr key={student.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-white font-bold">
                                                {student.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium">{student.name}</div>
                                                <div className="text-xs text-slate-500">ID: {student.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            student.risk === 'High' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                            student.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                                            'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                        }`}>
                                            {student.risk} Risk
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-300 text-sm">
                                        {student.gap}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden max-w-[80px]">
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${student.prob}%` }}
                                                    className={`h-full ${student.prob > 70 ? 'bg-red-500' : student.prob > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                                />
                                            </div>
                                            <span className="text-xs font-mono text-slate-400">{student.prob}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {student.activity}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all" title="Message Student">
                                                <MessageSquare size={16} />
                                            </button>
                                            <button className="p-2 bg-white/5 text-slate-400 hover:text-white rounded-lg transition-all" title="View Detailed Progress">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI Insights Panel */}
            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-all duration-700" />
                <div className="relative z-10">
                    <h4 className="text-indigo-400 font-bold mb-4 flex items-center gap-2">
                        <TrendingDown size={18} />
                        Institutional AI Recommendation
                    </h4>
                    <p className="text-slate-300 text-lg leading-relaxed max-w-4xl">
                        "Your class is currently showing a **15% performance dip** in 'Cybersecurity Fundamentals'. 
                        AI analysis suggests the concept of 'Public Key Infrastructure' is the main friction point. 
                        We recommend hosting a live 10-minute workshop or distributing the 'PKI Visual Guide' to the class."
                    </p>
                    <button className="mt-6 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
                        Action This Insight
                    </button>
                </div>
            </div>
        </div>
    );
};
