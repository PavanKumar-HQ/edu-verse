import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Globe, Target, Zap, Award, Activity, TrendingUp, Clock, Shield, ChevronRight, Flame, Star, X, Bot, Sparkles } from 'lucide-react';
import { adaptiveService } from '../../services/api';
import { AdaptiveQuiz } from '../quiz/AdaptiveQuiz';
import { DNASphere } from '../dna/DNASphere';
import { InteractiveGalaxy } from '../galaxy-map/InteractiveGalaxy';
import { CognitiveRadar } from '../analytics/CognitiveRadar';
import { SkillTree } from '../gamification/SkillTree';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { useLearningDNA } from '../../hooks/useLearningDNA';
import { Calendar, Plus } from 'lucide-react';
import { DeepTutorPanel } from '../features/DeepTutorPanel';
import { StudyAgentWizard } from '../features/StudyAgentWizard';
import { HoloMentorAvatar } from '../features/HoloMentorAvatar';

type Tab = 'overview' | 'analytics' | 'skills' | 'missions' | 'deeptutor' | 'studyagent' | 'holomentor';

const TABS: { id: Tab; label: string; icon: any; isNew?: boolean }[] = [
  { id: 'overview',    label: 'Overview',     icon: Brain },
  { id: 'analytics',   label: 'Analytics',    icon: TrendingUp },
  { id: 'skills',      label: 'Skill Tree',   icon: Target },
  { id: 'missions',    label: 'Missions',     icon: Zap },
  { id: 'deeptutor',   label: 'Deep Tutor',   icon: Brain,     isNew: true },
  { id: 'studyagent',  label: 'Study Agent',  icon: Sparkles,  isNew: true },
  { id: 'holomentor',  label: 'Holo-Mentor',  icon: Bot,       isNew: true },
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
  const { dna, xpProgress, setGoal, updateAfterQuiz } = useLearningDNA();
  const [tab, setTab] = useState<Tab>('overview');
  const [quizOpen, setQuizOpen] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', deadline: '' });
  const [analytics, setAnalytics] = useState<{ efficiency: number; momentum: string; risk: string } | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adaptiveService.getAnalytics('user_123'); // Mock user ID for now
        if (res.status === 'success') {
          setAnalytics(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    fetchAnalytics();
  }, []);

  const DNA_STATS = [
    { label: 'Cognitive Velocity', value: dna.cognitiveVelocity, color: 'from-blue-500 to-cyan-400', textColor: 'text-cyan-400' },
    { label: 'Neural Retention',   value: dna.neuralRetention,   color: 'from-purple-500 to-pink-400', textColor: 'text-purple-400' },
    { label: 'Focus Frequency',    value: dna.focusFrequency,    color: 'from-emerald-500 to-teal-400', textColor: 'text-emerald-400' },
    { label: 'Practical Synergy',  value: dna.practicalSynergy,  color: 'from-orange-500 to-red-400', textColor: 'text-orange-400' },
  ];

  const handleSetGoal = () => {
    if (newGoal.title && newGoal.deadline) {
      setGoal(newGoal.title, newGoal.deadline);
      setShowGoalModal(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Mission Control</h2>
          <p className="text-slate-400 font-mono text-sm mt-1">
            System Status: <span className="text-emerald-400">Optimal</span> · Neural Sync: <span className="text-blue-400">98.4%</span> · Style: <span className="text-purple-400 capitalize">{dna.learningStyle}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="glass-panel px-5 py-3 rounded-2xl border-white/10 flex items-center gap-3">
            <Flame className="text-orange-400" size={18} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Streak</p>
              <p className="text-sm font-bold text-white">{dna.streak} Days</p>
            </div>
          </div>
          <div className="glass-panel px-5 py-3 rounded-2xl border-white/10 flex items-center gap-3">
            <Award className="text-purple-400" size={18} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Rank</p>
              <p className="text-sm font-bold text-white">{dna.rank}</p>
            </div>
          </div>
          <div className="glass-panel px-5 py-3 rounded-2xl border-white/10 flex items-center gap-3">
            <Star className="text-yellow-400" size={18} />
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold">XP</p>
              <p className="text-sm font-bold text-white">{dna.xp.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="glass-panel p-4 rounded-2xl border-white/10">
        <div className="flex justify-between text-xs font-bold mb-2">
          <span className="text-slate-400">Level {dna.level} — {dna.rank}</span>
          <span className="text-white">{dna.xp % 500} / 500 XP to Level {dna.level + 1}</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`relative flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold whitespace-nowrap transition-all border ${tab === t.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'}`}>
            <t.icon size={15} />
            {t.label}
            {t.isNew && (
              <span className="absolute -top-1.5 -right-1.5 text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full leading-none">NEW</span>
            )}
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
                  { label: 'Weak Topic Fix', desc: dna.weakTopics[0] || 'Neural Weights', color: 'border-red-500/30 bg-red-500/5', icon: '⚠️', action: 'Fix Now' },
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

            {/* Goal & Study Planner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-panel p-6 rounded-[2.5rem] border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Target className="text-purple-400" size={18} /> Active Goal
                  </h3>
                  {!dna.currentGoal && (
                    <button onClick={() => setShowGoalModal(true)} className="p-1.5 bg-white/5 rounded-lg text-slate-400 hover:text-white"><Plus size={16} /></button>
                  )}
                </div>
                {dna.currentGoal ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-white font-bold">{dna.currentGoal.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Deadline: {dna.currentGoal.deadline}</p>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${dna.currentGoal.progress}%` }} className="h-full bg-purple-500" />
                    </div>
                    <p className="text-right text-[10px] text-purple-400 font-bold">{dna.currentGoal.progress}% Path Mastery</p>
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                    <p className="text-xs text-slate-500">No active goal set</p>
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="glass-panel p-6 rounded-[2.5rem] border-white/10">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Calendar className="text-blue-400" size={18} /> Study Planner
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white font-medium">14:00 - AI Lab Session</p>
                    <p className="text-[10px] text-slate-500">Practical focus · 45 mins</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 opacity-50">
                    <p className="text-xs text-white font-medium">16:30 - Ethics Quiz</p>
                    <p className="text-[10px] text-slate-500">Theoretical · 15 mins</p>
                  </div>
                </div>
              </motion.div>
            </div>

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
              {dna.dailyQuests.map(m => {
                const done = m.completed;
                return (
                  <div key={m.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${done ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10 hover:bg-white/8'}`}>
                    <div className={`p-3 rounded-xl ${done ? 'bg-emerald-500/20' : 'bg-white/10'}`}>
                      <Zap size={20} className={done ? 'text-emerald-400' : 'text-blue-400'} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${done ? 'line-through text-slate-500' : 'text-white'}`}>{m.text}</p>
                      <p className="text-xs text-slate-500 mt-0.5">+{m.xp} XP</p>
                    </div>
                    {done ? (
                      <span className="text-emerald-400 text-xs font-bold">✓ Done</span>
                    ) : (
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors">
                        Go
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
                { label: 'Learning Efficiency', value: `${analytics?.efficiency || '0.00'}`, sub: 'XP gained per hour', color: 'text-emerald-400', ring: 'border-emerald-500/30' },
                { label: 'Neural Momentum', value: analytics?.momentum || 'Steady', sub: 'Performance trend', color: 'text-blue-400', ring: 'border-blue-500/30' },
                { label: 'Academic Risk', value: analytics?.risk || 'Low', sub: 'AI segmentation', color: analytics?.risk === 'Critical Risk' ? 'text-red-400' : 'text-purple-400', ring: 'border-purple-500/30' },
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

      {/* ── NEW FEATURE TABS ───────────────────────────────────────── */}

      {/* Deep Tutor Tab */}
      {tab === 'deeptutor' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-[2.5rem] border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 border border-blue-500/30">
              <Brain className="text-blue-400" size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">ASTRA Deep Tutor</h3>
              <p className="text-xs text-slate-400 font-mono">Multi-mode AI tutoring · Powered by DeepTutor concepts</p>
            </div>
            <div className="ml-auto flex gap-2">
              {['ELI10','ExamPrep','Interview','RealWorld'].map(m => (
                <span key={m} className="text-[10px] bg-white/5 border border-white/10 text-slate-500 px-2 py-1 rounded-full">{m}</span>
              ))}
            </div>
          </div>
          <DeepTutorPanel />
        </motion.div>
      )}

      {/* Study Agent Wizard Tab */}
      {tab === 'studyagent' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-[2.5rem] border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-purple-500/20 border border-purple-500/30">
              <Sparkles className="text-purple-400" size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Multi-Agent Study Assistant</h3>
              <p className="text-xs text-slate-400 font-mono">4-step wizard · Analyzer · Roadmap · Resources · Quiz · Tutor</p>
            </div>
            <div className="ml-auto flex gap-2">
              {['Analyzer','Roadmap','Resources','Quiz'].map(a => (
                <span key={a} className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-2 py-1 rounded-full">{a}</span>
              ))}
            </div>
          </div>
          <StudyAgentWizard />
        </motion.div>
      )}

      {/* Holo-Mentor Avatar Tab */}
      {tab === 'holomentor' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-[2.5rem] border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/30">
              <Bot className="text-cyan-400" size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Holo-Mentor Avatar</h3>
              <p className="text-xs text-slate-400 font-mono">Talking AI tutor · Expression engine · Voice I/O · Persona system</p>
            </div>
            <div className="ml-auto">
              <span className="text-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold">🎭 Live Avatar</span>
            </div>
          </div>
          <HoloMentorAvatar />
        </motion.div>
      )}

      {/* Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-4">Set Learning Goal</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Goal Title</label>
                  <input type="text" value={newGoal.title} onChange={e => setNewGoal({ ...newGoal, title: e.target.value })}
                    placeholder="e.g. Become an AI Engineer" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase font-bold mb-1 block">Target Date</label>
                  <input type="date" value={newGoal.deadline} onChange={e => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:border-blue-500 outline-none" />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => setShowGoalModal(false)} className="flex-1 px-4 py-2 rounded-xl text-slate-400 hover:bg-white/5 transition-colors font-bold text-sm">Cancel</button>
                  <button onClick={handleSetGoal} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20">Set Path</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
