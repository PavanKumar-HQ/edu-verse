import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Zap, Shield, Smile, Globe, Sparkles, X, Send, Maximize2 } from 'lucide-react';

type Mode = 'mentor' | 'quiz' | 'simplify' | 'rescue' | 'motivation' | 'analogy' | 'interview';
interface Msg { role: 'astra' | 'user'; text: string; }

const RESPONSES: Record<Mode, (t: string) => string> = {
  mentor: (t) => t.includes('stuck') 
    ? "Let's break it down into 3 micro-steps. What specifically lost you?" 
    : "Based on your DNA profile, start with the concept → lab simulation → mini quiz. Which topic?",
  quiz: () => "❓ **What does CIA stand for in cybersecurity?**\nA) Central Intelligence Agency\nB) Confidentiality, Integrity, Availability ✓\nC) Code Injection Attack\nD) Cloud Integration API\n\nType A, B, C, or D!",
  simplify: () => "Think of it like a traffic system 🚦 — data packets are cars, routers are traffic lights, firewalls are checkpoints that only let approved cars through.",
  rescue: () => "🆘 Rescue Mode! Take a breath. Start with just ONE concept. Write it in your own words first — that alone solves 60% of confusion. What's the single thing blocking you?",
  motivation: () => "🔥 You're on a 7-day streak — top 8% globally! 8 labs completed, 23 quizzes crushed. You're a Technomancer. One more session and you unlock the next tier!",
  analogy: (t) => t.includes('api') 
    ? "An API is like a waiter — you order, kitchen cooks, waiter delivers. You never see the kitchen." 
    : "A firewall is a nightclub bouncer — checks IDs, blocks suspicious guests, lets approved traffic through.",
  interview: () => "**Interview Q:** 'Describe the OSI model and how it applies to a real attack.'\n\nStructure: Layer overview → Attack target layer → Mitigation. You've got this!",
};

const MODES = [
  { id: 'mentor' as Mode,     label: 'Mentor',    icon: Brain,     color: 'text-blue-400' },
  { id: 'quiz' as Mode,       label: 'Quiz',      icon: Target,    color: 'text-red-400' },
  { id: 'simplify' as Mode,   label: 'Simplify',  icon: Zap,       color: 'text-yellow-400' },
  { id: 'rescue' as Mode,     label: 'Rescue',    icon: Shield,    color: 'text-purple-400' },
  { id: 'motivation' as Mode, label: 'Boost',     icon: Smile,     color: 'text-emerald-400' },
  { id: 'analogy' as Mode,    label: 'Analogy',   icon: Globe,     color: 'text-pink-400' },
  { id: 'interview' as Mode,  label: 'Interview', icon: Sparkles,  color: 'text-orange-400' },
];

export const AstraTutor: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [mode, setMode] = useState<Mode>('mentor');
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'astra', text: "Greetings, Voyager! I'm Astra 🧠 — your AI mentor. You're on a 7-day streak! What shall we conquer today?" }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(p => [...p, { role: 'user', text: input }]);
    const userInput = input;
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMsgs(p => [...p, { role: 'astra', text: RESPONSES[mode](userInput.toLowerCase()) }]);
      setTyping(false);
    }, 700);
  };

  const cls = full ? 'fixed inset-4 z-[200] rounded-[2rem]' : 'w-[390px] h-[580px]';

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button key="orb" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)}>
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-blue-500/30" />
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-purple-600 p-[2px] shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Brain className="text-cyan-400" size={26} />
              </div>
            </div>
          </motion.button>
        ) : (
          <motion.div key="panel" initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className={`${cls} bg-slate-900/95 backdrop-blur-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden`}>

            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-white/5 bg-gradient-to-b from-blue-500/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center">
                  <Brain size={16} className="text-white" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Astra AI</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Holographic Active</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => setFull(!full)} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white"><Maximize2 size={14} /></button>
                <button onClick={() => setOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white"><X size={14} /></button>
              </div>
            </div>

            {/* Modes */}
            <div className="flex-shrink-0 p-2 grid grid-cols-4 gap-1 border-b border-white/5 bg-black/20">
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center gap-1 py-2 rounded-xl border transition-all ${mode === m.id ? 'bg-blue-500/20 border-blue-500/40' : 'border-transparent hover:bg-white/5'}`}>
                  <m.icon size={12} className={m.color} />
                  <span className="text-[8px] font-bold uppercase text-slate-400">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'}`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl w-16">
                  {[0,1,2].map(i => <motion.div key={i} animate={{ y: [0,-4,0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i*0.15 }} className="w-1.5 h-1.5 rounded-full bg-blue-400" />)}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick prompts */}
            <div className="flex-shrink-0 px-4 pb-2 flex gap-2 overflow-x-auto">
              {["What should I study?", "I'm stuck", "Quiz me"].map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  className="flex-shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-slate-400 hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t border-white/5 bg-black/20 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={`Ask in ${MODES.find(m => m.id === mode)?.label} mode...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 placeholder:text-slate-600" />
              <motion.button whileTap={{ scale: 0.9 }} onClick={send} disabled={!input.trim()}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-xl flex items-center justify-center text-white flex-shrink-0">
                <Send size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
