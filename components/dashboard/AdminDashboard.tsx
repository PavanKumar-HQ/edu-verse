import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users, TrendingUp, Activity, Brain, Zap, Globe, Shield,
  BarChart2, AlertTriangle, CheckCircle, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const PLATFORM_STATS = [
  { label: 'Active Learners',    value: '2,847', change: '+12%', up: true,  icon: Users,      color: 'text-blue-400',    bg: 'bg-blue-500/10' },
  { label: 'Quiz Attempts',      value: '14,230', change: '+28%', up: true, icon: Brain,      color: 'text-purple-400',  bg: 'bg-purple-500/10' },
  { label: 'Labs Completed',     value: '3,891',  change: '+19%', up: true, icon: Zap,        color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { label: 'Astra AI Queries',   value: '8,102',  change: '+45%', up: true, icon: Activity,   color: 'text-cyan-400',    bg: 'bg-cyan-500/10' },
  { label: 'Avg. Session Time',  value: '42 min', change: '-3%',  up: false, icon: TrendingUp, color: 'text-orange-400',  bg: 'bg-orange-500/10' },
  { label: 'Drop-off Rate',      value: '8.2%',   change: '-5%',  up: true,  icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const GROWTH_DATA = [
  { month: 'Jan', users: 1200, completions: 800 },
  { month: 'Feb', users: 1450, completions: 950 },
  { month: 'Mar', users: 1800, completions: 1200 },
  { month: 'Apr', users: 2100, completions: 1500 },
  { month: 'May', users: 2847, completions: 1890 },
];

const COURSE_PERF = [
  { name: 'Cybersecurity', students: 890, avg: 78 },
  { name: 'AI/ML',         students: 720, avg: 82 },
  { name: 'Blockchain',    students: 430, avg: 65 },
  { name: 'Fintech',       students: 380, avg: 71 },
  { name: 'Soft Skills',   students: 427, avg: 88 },
];

const ENGAGEMENT_PIE = [
  { name: 'Labs',       value: 35, color: '#3b82f6' },
  { name: 'Videos',     value: 28, color: '#8b5cf6' },
  { name: 'Quizzes',    value: 20, color: '#10b981' },
  { name: 'Astra AI',   value: 12, color: '#06b6d4' },
  { name: 'Resources',  value: 5,  color: '#f59e0b' },
];

const AT_RISK_INSTITUTIONS = [
  { name: 'Batch A — Engineering', risk: 'High',   students: 42, issue: 'Network Security module plateau' },
  { name: 'Batch B — Commerce',    risk: 'Medium', students: 31, issue: 'Low Blockchain completion rate' },
  { name: 'Batch C — Science',     risk: 'Low',    students: 58, issue: 'None — excelling' },
];

const RISK_COLORS: Record<string, string> = {
  High:   'text-red-400 bg-red-500/10 border-red-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Low:    'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

import { useAppContext } from '../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'ai'>('overview');
  const { platformStats, radarStats, updateRadarStat } = useAppContext();

  // Map icons from strings
  const IconMap: Record<string, any> = { Users, TrendingUp, Activity, Brain, Zap, AlertTriangle };

  const simulateActivity = () => {
    // Randomly boost radar stats
    radarStats.forEach(stat => {
      const boost = Math.floor(Math.random() * 5) + 1;
      updateRadarStat(stat.subject, Math.min(100, stat.A + boost));
    });
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Platform Intelligence</h2>
          <p className="text-slate-400 text-sm mt-1">Real-time analytics · AI monitoring · Institution reporting</p>
        </div>
        <div className="flex gap-2">
          <button onClick={simulateActivity} className="px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-xl text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-2">
            <Activity size={14} /> Simulate Activity
          </button>
          {(['overview', 'courses', 'ai'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border transition-all ${activeTab === t ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'}`}>
              {t === 'ai' ? 'AI Stats' : t}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {platformStats.map((stat, i) => {
          const IconComp = IconMap[stat.icon] || Activity;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl">
              <div className={`p-2 ${stat.bg} rounded-xl w-fit mb-3`}>
                <IconComp size={16} className={stat.color} />
              </div>
              <p className="text-slate-400 text-[10px] uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="text-white font-bold text-lg leading-none mb-1">{stat.value}</p>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {stat.up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                {stat.change} this month
              </div>
            </motion.div>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Growth Chart + Engagement Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-slate-900/40 border border-white/5 rounded-3xl p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-400" /> Platform Growth
              </h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={GROWTH_DATA}>
                    <defs>
                      <linearGradient id="gUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gComp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff08" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }} itemStyle={{ color: '#fff' }} />
                    <Area type="monotone" dataKey="users" stroke="#3b82f6" fill="url(#gUsers)" strokeWidth={2} name="Users" />
                    <Area type="monotone" dataKey="completions" stroke="#10b981" fill="url(#gComp)" strokeWidth={2} name="Completions" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
              <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                <Activity size={16} className="text-cyan-400" /> Engagement Mix
              </h4>
              <div className="h-48 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ENGAGEMENT_PIE} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                      {ENGAGEMENT_PIE.map((e, i) => <Cell key={i} fill={e.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2 mt-2">
                {ENGAGEMENT_PIE.map(e => (
                  <div key={e.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: e.color }} />
                      <span className="text-slate-400">{e.name}</span>
                    </div>
                    <span className="text-white font-bold">{e.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* At-Risk Institutions */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" /> Institution-Level Risk Monitor
            </h4>
            <div className="space-y-3">
              {AT_RISK_INSTITUTIONS.map(inst => (
                <div key={inst.name} className="flex items-center justify-between p-4 bg-white/3 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <Globe size={18} className="text-slate-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{inst.name}</p>
                      <p className="text-xs text-slate-500">{inst.issue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">{inst.students} students</span>
                    <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${RISK_COLORS[inst.risk]}`}>{inst.risk}</span>
                    {inst.risk !== 'Low' && (
                      <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-lg transition-colors">
                        Intervene
                      </button>
                    )}
                    {inst.risk === 'Low' && <CheckCircle size={16} className="text-emerald-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'courses' && (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6">
          <h4 className="text-white font-bold mb-6 flex items-center gap-2">
            <BarChart2 size={16} className="text-blue-400" /> Course Performance Analysis
          </h4>
          <div className="h-72 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={COURSE_PERF} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#ffffff08" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 12 }} />
                <Bar dataKey="avg" name="Avg Score %" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {COURSE_PERF.map(c => (
              <div key={c.name} className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                <p className="text-xs text-slate-500 mb-1">{c.name}</p>
                <p className="text-xl font-bold text-white">{c.avg}%</p>
                <p className="text-[10px] text-slate-500 mt-1">{c.students} students</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { label: 'Total Astra Queries', value: '8,102', icon: Brain, color: 'text-blue-400', desc: 'avg 2.8 queries per session' },
            { label: 'Most Used Mode', value: 'Mentor', icon: Activity, color: 'text-purple-400', desc: '42% of all interactions' },
            { label: 'Quiz AI Completions', value: '6,340', icon: CheckCircle, color: 'text-emerald-400', desc: '78% completion rate' },
            { label: 'Intervention Alerts', value: '124', icon: AlertTriangle, color: 'text-red-400', desc: 'sent to teachers this month' },
            { label: 'Skill Tree Unlocks', value: '892', icon: Zap, color: 'text-yellow-400', desc: 'nodes unlocked platform-wide' },
            { label: 'DNA Profiles Active', value: '2,847', icon: Shield, color: 'text-cyan-400', desc: 'personalized learning profiles' },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-0.5">{stat.label}</p>
                <p className="text-2xl font-extrabold text-white">{stat.value}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{stat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
