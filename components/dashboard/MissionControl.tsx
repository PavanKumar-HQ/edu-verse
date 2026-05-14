import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Globe, Target, Zap, Award, Activity, TrendingUp, Clock, Shield, ChevronRight, Flame, Star, X } from 'lucide-react';
import { AdaptiveQuiz } from '../quiz/AdaptiveQuiz';
import { DNASphere } from '../dna/DNASphere';
import { InteractiveGalaxy } from '../galaxy-map/InteractiveGalaxy';
import { CognitiveRadar } from '../analytics/CognitiveRadar';
import { SkillTree } from '../gamification/SkillTree';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';

type Tab = 'overview' | 'galaxy' | 'analytics' | 'skills' | 'missions';

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: 'overview',   label: 'Overview',   icon: Brain },
  { id: 'galaxy',     label: 'Galaxy Map', icon: Globe },
  { id: 'analytics',  label: 'Analytics',  icon: TrendingUp },
  { id: 'skills',     label: 'Skill Tree', icon: Target },
  { id: 'missions',   label: 'Missions',   icon: Zap },
];

const DNA_STATS = [
  { label: 'Cognitive Velocity', value: 72, color: 'from-blue-500 to-cyan-400', textColor: 'text-cyan-400' },
  { label: 'Neural Retention',   value: 85, color: 'from-purple-500 to-pink-400', textColor: 'text-purple-400' },
  { label: 'Focus Frequency',    value: 68, color: 'from-emerald-500 to-teal-400', textColor: 'text-emerald-400' },
  { label: 'Practical Synergy',  value: 91, color: 'from-orange-500 to-red-400', textColor: 'text-orange-400' },
];

const MISSIONS = [
  { id: 'm1', title: 'Complete 1 Lab Simulation', xp: 200, icon: Shield, color: 'text-blue-400', done: false },
  { id: 'm2', title: 'Score 80%+ on any Quiz',    xp: 150, icon: Target, color: 'text-purple-400', done: true  },
  { id: 'm3', title: 'Study for 30 minutes',      xp: 100, icon: Clock,  color: 'text-emerald-400', done: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Alex K.',   xp: 9200, badge: '🥇' },
  { rank: 2, name: 'Priya M.',  xp: 8750, badge: '🥈' },
  { rank: 3, name: 'You',       xp: 4820, badge: '⚡', isYou: true },
  { rank: 4, name: 'Jordan S.', xp: 4100, badge: '🎯' },
  { rank: 5, name: 'Liam T.',   xp: 3800, badge: '🔥' },
];

export const MissionControl: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  const [completedMissions, setCompletedMissions] = useState<string[]>(['m2']);
  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Mission Control</h2>
          <p className="text-slate-400 font-mono text-sm mt-1">
            System Status: <span className="text-emerald-400">Optimal</span> · Neural Sync: <span className="text-blue-400">98.4%</span> · Streak: <span className="text-orange-400">🔥 7 days</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-5 py-3 rounded-2xl border-white/10 flex items-center gap-3">
            <Flame className="text-orange-400" size={18} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Streak</p>
              <p className="text-sm font-bold text-white">7 Days</p>
            </div>
          </div>
          <div className="glass-panel px-5 py-3 rounded-2xl border-white/10 flex items-center gap-3">
            <Award className="text-purple-400" size={18} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Rank</p>
              <p className="text-sm font-bold text-white">Technomancer</p>
            </div>
          </div>
          <div className="glass-panel px-5 py-3 rounded-2xl border-white/10 flex items-center gap-3">
            <Star className="text-yellow-400" size={18} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">XP</p>
              <p className="text-sm font-bold text-white">4,820</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="glass-panel p-4 rounded-2xl border-white/10">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-400">Level 14 — Technomancer</span>
          <span className="text-white">320 / 500 XP to Level 15</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: '64%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${tab === t.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'}`}>
            <t.icon size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* DNA Panel */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-8 rounded-[2.5rem] border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-blue-500/20"><Brain className="text-blue-400" size={20} /></div>
                <h3 className="text-xl font-bold text-white">Learning DNA</h3>
              </div>
              <div className="flex justify-center mb-8">
                <div className="w-40 h-40"><DNASphere /></div>
              </div>
              <div className="space-y-5">
                {DNA_STATS.map(s => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-400 uppercase tracking-wider">{s.label}</span>
                      <span className={s.textColor}>{s.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${s.value}%` }}
                        transition={{ duration: 1.2, ease: 'easeOut' }}
                        className={`h-full bg-gradient-to-r ${s.color}`} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Astra Insight</p>
                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "Your practical synergy is exceptional. Focus on boosting Neural Retention with spaced repetition to reach peak performance."
                </p>
              </div>
            </motion.div>

            {/* Skill Radar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-[2.5rem] border-white/10 h-[320px]">
              <CognitiveRadar />
            </motion.div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Recommended Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-[2.5rem] border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Activity className="text-cyan-400" size={18} /> AI Recommended — Next Steps
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Weak Topic Fix', desc: 'SQL Injection refresher', color: 'border-red-500/30 bg-red-500/5', icon: '⚠️', action: 'Fix Now' },
                  { label: 'Next Best Lesson', desc: 'Zero Trust Architecture', color: 'border-blue-500/30 bg-blue-500/5', icon: '📚', action: 'Start' },
                  { label: 'Practice Lab', desc: 'Network Intrusion Sim', color: 'border-emerald-500/30 bg-emerald-500/5', icon: '🧪', action: 'Launch' },
                ].map(card => (
                  <div key={card.label} className={`p-4 rounded-2xl border ${card.color}`}>
                    <p className="text-xl mb-2">{card.icon}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{card.label}</p>
                    <p className="text-sm text-white font-medium mb-3">{card.desc}</p>
                    <button className="text-xs font-bold text-blue-400 hover:text-white flex items-center gap-1 transition-colors">
                      {card.action} <ChevronRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Boss Battles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Siege of the Citadel', desc: 'Defend core server against multi-vector attacks.', tag: 'Boss Battle', tagColor: 'text-red-400 bg-red-500/10 border-red-500/20', icon: Shield, iconBg: 'bg-red-500/20 text-red-400', gradient: 'from-red-600/10', cta: 'Start Battle', ctaColor: 'text-red-400' },
                { title: 'Logic Wormhole',       desc: 'Solve 5 AI ethics dilemmas for 500 XP.',         tag: 'Daily Mission', tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Zap, iconBg: 'bg-blue-500/20 text-blue-400', gradient: 'from-blue-600/10', cta: 'Launch', ctaColor: 'text-blue-400', onClick: () => setQuizOpen(true) },
      ].map(c => (
        <motion.div key={c.title} whileHover={{ y: -4 }}
          className="glass-panel p-6 rounded-[2.5rem] border-white/10 group cursor-pointer relative overflow-hidden"
          onClick={c.onClick}>
          <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${c.iconBg}`}><c.icon size={22} /></div>
              <span className={`px-3 py-1 rounded-full border text-[10px] font-bold uppercase ${c.tagColor}`}>{c.tag}</span>
            </div>
            <h4 className="text-xl font-bold text-white mb-2">{c.title}</h4>
            <p className="text-slate-400 text-sm mb-4">{c.desc}</p>
            <button className={`flex items-center gap-1 text-sm font-bold ${c.ctaColor} group-hover:translate-x-1 transition-transform`}>
              {c.cta} <ChevronRight size={14} />
            </button>
          </div>
        </motion.div>
      ))}
    </div>

            {/* Leaderboard */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass-panel p-6 rounded-[2.5rem] border-white/10">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Award className="text-yellow-400" size={18} /> Global Leaderboard
              </h3>
              <div className="space-y-2">
                {LEADERBOARD.map(p => (
                  <div key={p.rank} className={`flex items-center gap-4 p-3 rounded-2xl transition-colors ${p.isYou ? 'bg-blue-500/15 border border-blue-500/30' : 'hover:bg-white/5'}`}>
                    <span className="text-xl w-8 text-center">{p.badge}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${p.isYou ? 'text-blue-400' : 'text-white'}`}>{p.name} {p.isYou && '(You)'}</p>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{p.xp.toLocaleString()} XP</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {tab === 'galaxy' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-panel p-8 rounded-[2.5rem] border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-cyan-500/20"><Globe className="text-cyan-400" size={20} /></div>
            <h3 className="text-xl font-bold text-white">Interactive Knowledge Galaxy</h3>
            <div className="ml-auto px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" /> Live Orbit
            </div>
          </div>
          <InteractiveGalaxy onPlanetClick={(id) => console.log('Planet:', id)} />
        </motion.div>
      )}

      {tab === 'analytics' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AIAnalyticsDashboard userId="student_001" />
        </motion.div>
      )}

      {tab === 'skills' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="glass-panel p-8 rounded-[2.5rem] border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-purple-500/20"><Target className="text-purple-400" size={20} /></div>
            <h3 className="text-xl font-bold text-white">Neural Skill Tree</h3>
            <span className="ml-auto text-xs font-mono text-slate-500">Level 14 — Technomancer</span>
          </div>
          <div className="h-[500px]"><SkillTree /></div>
        </motion.div>
      )}

      {tab === 'missions' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="glass-panel p-6 rounded-[2.5rem] border-white/10">
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Zap className="text-yellow-400" size={18} /> Daily Missions
            </h3>
            <p className="text-xs text-slate-500 mb-6">Refreshes daily · Complete all for 50 bonus XP</p>
            <div className="space-y-4">
              {MISSIONS.map(m => {
                const done = completedMissions.includes(m.id);
                return (
                  <div key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/8'}`}>
                    <div className={`p-3 rounded-xl ${done ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                      <m.icon size={20} className={done ? 'text-emerald-400' : m.color} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${done ? 'line-through text-slate-500' : 'text-white'}`}>{m.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">+{m.xp} XP</p>
                    </div>
                    {done ? (
                      <span className="text-emerald-400 text-xs font-bold">✓ Done</span>
                    ) : (
                      <button onClick={() => setCompletedMissions(p => [...p, m.id])}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors">
                        Complete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Prediction */}
          <div className="glass-panel p-6 rounded-[2.5rem] border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-400" size={18} /> AI Performance Prediction
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Success Probability', value: '94%', sub: 'Based on current trajectory', color: 'text-emerald-400', ring: 'border-emerald-500/30' },
                { label: 'Burnout Risk', value: 'Low (18%)', sub: 'Healthy learning pace', color: 'text-blue-400', ring: 'border-blue-500/30' },
                { label: 'Predicted Grade', value: 'A+', sub: 'If streak maintained', color: 'text-purple-400', ring: 'border-purple-500/30' },
              ].map(p => (
                <div key={p.label} className={`p-5 rounded-2xl bg-white/5 border ${p.ring}`}>
                  <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">{p.label}</p>
                  <p className={`text-2xl font-extrabold ${p.color}`}>{p.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{p.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
      {/* Adaptive Quiz Modal */}
      <AnimatePresence>
        {quizOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-slate-900/95 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-xl"><Zap size={18} className="text-blue-400" /></div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Logic Wormhole</h3>
                    <p className="text-[10px] text-slate-500">Adaptive AI Quiz · 5 Questions</p>
                  </div>
                </div>
                <button onClick={() => setQuizOpen(false)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white">
                  <X size={16} />
                </button>
              </div>
              <AdaptiveQuiz onComplete={(score) => { setQuizOpen(false); }} onClose={() => setQuizOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
