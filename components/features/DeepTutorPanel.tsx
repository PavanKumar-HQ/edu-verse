import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Mic, MicOff, Volume2, VolumeX, Sparkles, Zap, Target, Shield, Globe } from 'lucide-react';

type Mode = 'mentor' | 'quiz' | 'simplify' | 'rescue' | 'analogy';
type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Msg { role: 'user' | 'ai'; text: string; }

const FALLBACK: Record<Mode, (t: string) => string> = {
  mentor: (t) => `For "${t || 'your question'}", here's my approach: start with the core concept → build a small example → test edge cases. What's your current understanding?`,
  quiz: () => "❓ **Quiz Time!**\nWhat is the primary purpose of a firewall?\nA) Speed up internet\nB) Block unauthorized network access ✓\nC) Store passwords\nD) Encrypt files\n\nType A, B, C, or D!",
  simplify: (t) => `Imagine ${t || 'this'} like a post office 📮 — you write a letter (data), seal it (encrypt), address it (routing), and the postman (router) delivers it to exactly the right house. Simple!`,
  rescue: () => "🆘 I've got you! Stop, breathe. Pick ONE thing that confuses you most. Write it in your own words — even if it's wrong. That single act unlocks 60% of understanding. What's that one thing?",
  analogy: (t) => `${t || 'This concept'} is like a city's water system 🌊 — the reservoir is your database, pipes are APIs, faucets are endpoints, and water pressure is server load. Which part of the 'city' do you want to explore?`,
};

const MODES = [
  { id: 'mentor' as Mode, label: 'Mentor', icon: Brain, color: '#3b82f6' },
  { id: 'quiz' as Mode, label: 'Quiz', icon: Target, color: '#ef4444' },
  { id: 'simplify' as Mode, label: 'Simplify', icon: Zap, color: '#eab308' },
  { id: 'rescue' as Mode, label: 'Rescue', icon: Shield, color: '#a855f7' },
  { id: 'analogy' as Mode, label: 'Analogy', icon: Globe, color: '#ec4899' },
];

export const DeepTutorPanel: React.FC = () => {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'ai', text: "Welcome to ASTRA Deep Tutor! 🧠\n\nI'm your AI-powered learning companion with real Gemini intelligence + offline fallback. Choose a mode, ask anything, or use voice input.\n\nWhat topic shall we master today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<Mode>('mentor');
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [aiStatus, setAiStatus] = useState<'online' | 'fallback'>('online');
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, '').slice(0, 300));
    utt.rate = 1.05; utt.pitch = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
    if (preferred) utt.voice = preferred;
    utt.onstart = () => setAvatarState('speaking');
    utt.onend = () => setAvatarState('idle');
    window.speechSynthesis.speak(utt);
  }, [ttsEnabled]);

  const toggleListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setInput("🎤 Voice not supported — please type your question."); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); setAvatarState('idle'); return; }
    const rec = new SR();
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = true;
    rec.onstart = () => { setIsListening(true); setAvatarState('listening'); };
    rec.onresult = (e: any) => {
      setInput(Array.from(e.results).map((r: any) => r[0].transcript).join(''));
    };
    rec.onerror = (e: any) => {
      setIsListening(false); setAvatarState('idle');
      if (e.error === 'not-allowed') setInput("🎤 Mic access denied — enable microphone in browser settings.");
    };
    rec.onend = () => { setIsListening(false); setAvatarState('idle'); };
    recognitionRef.current = rec;
    rec.start();
  }, [isListening]);

  const getResponse = useCallback(async (text: string, currentHistory: Msg[]) => {
    // Offline Mock Engine for DeepTutor
    const t = text.toLowerCase();
    const isStuck = t.includes('error') || t.includes('stuck') || t.includes('help') || t.includes('bug');
    const isQuestion = t.includes('?') || t.includes('what') || t.includes('how') || t.includes('why');
    
    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800)); // Simulate thinking

    let reply = "";
    if (mode === 'mentor') {
      if (isStuck) reply = pick([
        "Let's trace this back. Where exactly does the error originate?",
        "Don't worry, these hurdles are where the real learning happens. Break the problem down into smaller parts.",
        "Take a step back. Have you verified the inputs to the function before it fails?"
      ]);
      else if (isQuestion) reply = pick([
        `That's an insightful question about ${text}. Have you considered how it impacts the broader system architecture?`,
        "Good question. The answer usually depends on your specific use case. What are you trying to build?",
        "To understand that fully, we should look at the underlying principles. Want me to walk you through an example?"
      ]);
      else reply = pick([
        "I'm following your logic. Please continue.",
        "That's an interesting approach. How does it scale?",
        "Let's dive deeper into that. What's the next step?"
      ]);
    } else if (mode === 'quiz') {
      reply = pick([
        `Alright, quiz time on ${text}! Question: What is the primary bottleneck here?\nA) Execution speed\nB) Memory leak\nC) Syntax error\nD) Developer fatigue\n\nTake your best guess!`,
        `Let's test your knowledge! Question: If you remove this component entirely, what happens?\nA) Nothing\nB) The system crashes\nC) It defaults to an earlier version\nD) It scales infinitely\n\nWhat do you think?`
      ]);
    } else if (mode === 'simplify') {
      reply = pick([
        `Think of it like a restaurant kitchen. The chefs are your functions, and the waiters are your APIs delivering the food (data) to the customer.`,
        `Imagine a massive filing cabinet. Instead of searching every drawer, this concept acts like a master index card telling you exactly where to look.`,
        `It's like building a Lego house. You don't glue the pieces together permanently; you structure them so you can swap out windows and doors later.`
      ]);
    } else if (mode === 'rescue') {
      reply = pick([
        "Rescue Mode Activated! 🚨\n1. Stop writing code.\n2. Add a print statement before the crash.\n3. Check if the variable is what you expect.",
        "Let's fix this! 🛠️\nStep 1: Check your syntax and brackets.\nStep 2: Read the actual error message carefully.\nStep 3: Google the exact error string.",
        "Emergency protocol! 🚑\n1. Revert to the last working commit.\n2. Apply your changes one line at a time.\n3. See exactly where it breaks."
      ]);
    } else if (mode === 'analogy') {
      reply = pick([
        `Analogy 1: It's like a traffic cop directing data packets. Analogy 2: It's like a water valve controlling the flow of pressure.`,
        `Think of it as a translator at the UN, converting your high-level instructions into machine-readable actions.`,
        `It operates exactly like a post office sorting facility, grouping similar requests and dispatching them simultaneously.`
      ]);
    }

    setAiStatus('online');
    return reply;
  }, [mode]);

  const send = useCallback(async () => {
    if (!input.trim() || typing) return;
    const txt = input.trim();
    const currentMsgs = [...msgs, { role: 'user' as const, text: txt }];
    setMsgs(currentMsgs);
    setInput('');
    setTyping(true);
    setAvatarState('thinking');
    window.speechSynthesis?.cancel();
    const reply = await getResponse(txt, currentMsgs);
    setMsgs(p => [...p, { role: 'ai', text: reply }]);
    setTyping(false);
    setAvatarState('idle');
    speak(reply);
  }, [input, typing, msgs, getResponse, speak]);

  const stateColor = { idle: '#3b82f6', listening: '#10b981', thinking: '#a855f7', speaking: '#06b6d4' }[avatarState];

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[78vh] min-h-[560px]">
      {/* Avatar Panel */}
      <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-4">
        {/* Holographic Avatar */}
        <div className="flex-1 bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 50% 50%, ${stateColor}, transparent 70%)` }} />
          <svg width="160" height="160" viewBox="0 0 160 160" className="relative z-10">
            <defs>
              <radialGradient id="dg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={stateColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={stateColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="80" cy="80" r="75" fill="url(#dg)" />
            {[65, 72, 78].map((r, i) => (
              <motion.circle key={r} cx="80" cy="80" r={r} fill="none" stroke={stateColor} strokeWidth="0.8"
                animate={{ opacity: avatarState !== 'idle' ? [0.6, 0.1, 0.6] : [0.2, 0.05, 0.2], r: [r, r + 2, r] }}
                transition={{ duration: 1.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }} />
            ))}
            <circle cx="80" cy="68" r="28" fill="#0f172a" stroke={stateColor} strokeWidth="1.5" />
            <motion.ellipse cx="72" cy="65" rx="6" ry={avatarState === 'thinking' ? 2 : avatarState === 'listening' ? 8 : 6}
              fill={stateColor}
              animate={{ ry: avatarState === 'thinking' ? [6, 1, 6] : [6, 8, 6] }}
              transition={{ duration: avatarState === 'thinking' ? 0.6 : 2, repeat: Infinity }} />
            <motion.ellipse cx="88" cy="65" rx="6" ry={6} fill={stateColor}
              animate={{ ry: avatarState === 'thinking' ? [6, 1, 6] : [6, 8, 6] }}
              transition={{ duration: avatarState === 'thinking' ? 0.6 : 2, repeat: Infinity }} />
            {avatarState === 'speaking'
              ? <motion.path d="M 68 78 Q 80 86 92 78" stroke={stateColor} strokeWidth="2.5" fill="none"
                  animate={{ d: ["M 68 78 Q 80 86 92 78", "M 68 77 Q 80 84 92 77"] }}
                  transition={{ duration: 0.25, repeat: Infinity, repeatType: 'reverse' }} />
              : <path d="M 68 77 Q 80 83 92 77" stroke={stateColor} strokeWidth="1.5" fill="none" opacity="0.6" />
            }
            {(avatarState === 'speaking' || avatarState === 'listening') && [...Array(8)].map((_, i) => (
              <motion.rect key={i} x={50 + i * 9} y="100"
                width="5" rx="2.5"
                fill={stateColor} fillOpacity="0.8"
                animate={{ height: [4, Math.random() * 24 + 4, 4], y: [112, 112 - (Math.random() * 24), 112] }}
                transition={{ duration: 0.3 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.06 }} />
            ))}
          </svg>
          <div className="mt-3 text-center relative z-10">
            <p className="text-white font-bold text-lg">ASTRA</p>
            <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: stateColor }}>
              {avatarState === 'idle' ? (aiStatus === 'online' ? '● Gemini Active' : '● Smart Fallback') :
               avatarState === 'listening' ? '🎤 Listening' :
               avatarState === 'thinking' ? '⚡ Thinking' : '🔊 Speaking'}
            </p>
          </div>
        </div>
        {/* Mode Selector */}
        <div className="bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 space-y-1.5">
          <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Learning Mode</p>
          {MODES.map(m => (
            <button key={m.id} onClick={() => setMode(m.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl border transition-all text-left ${mode === m.id ? 'border-opacity-50 text-white' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
              style={mode === m.id ? { background: `${m.color}20`, borderColor: `${m.color}50` } : {}}>
              <m.icon size={14} style={{ color: m.color }} />
              <span className="text-sm font-medium">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 px-5 py-3 border-b border-white/5 flex items-center justify-between" style={{ background: `${stateColor}10` }}>
          <div className="flex items-center gap-2">
            <Sparkles size={16} style={{ color: stateColor }} />
            <span className="text-white font-bold text-sm">ASTRA Deep Tutor</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full border font-bold" style={{ color: stateColor, borderColor: `${stateColor}40`, background: `${stateColor}15` }}>
              {MODES.find(m => m.id === mode)?.label} Mode
            </span>
          </div>
          <button onClick={() => { setTtsEnabled(p => !p); if (ttsEnabled) window.speechSynthesis?.cancel(); }}
            className={`p-1.5 rounded-lg transition-all ${ttsEnabled ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500'}`}>
            {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          <AnimatePresence>
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                  m.role === 'user'
                    ? 'text-white rounded-tr-sm'
                    : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                }`} style={m.role === 'user' ? { background: `linear-gradient(135deg, ${stateColor}, #7c3aed)` } : {}}>
                  {m.role === 'ai' && <Sparkles size={12} className="mb-1.5 opacity-60" style={{ color: stateColor }} />}
                  {m.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: stateColor }}
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Waveform */}
        <AnimatePresence>
          {isListening && (
            <motion.div initial={{ height: 0 }} animate={{ height: 36 }} exit={{ height: 0 }}
              className="flex-shrink-0 flex items-center justify-center gap-1 px-5 overflow-hidden"
              style={{ background: `${stateColor}15` }}>
              {[...Array(24)].map((_, i) => (
                <motion.div key={i} className="w-1 rounded-full" style={{ background: stateColor }}
                  animate={{ height: [4, Math.random() * 22 + 4, 4] }}
                  transition={{ duration: 0.35 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.04 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick prompts */}
        <div className="flex-shrink-0 px-5 py-2 flex gap-2 overflow-x-auto">
          {["What should I study?", "I'm stuck", "Quiz me", "Give an analogy", "Motivate me!"].map((s, i) => (
            <button key={i} onClick={() => setInput(s)}
              className="flex-shrink-0 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-slate-400 hover:text-white transition-all">
              {s}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-white/5 bg-black/30 flex gap-2 items-center">
          <button onClick={toggleListening}
            className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${isListening ? 'animate-pulse text-white' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}`}
            style={isListening ? { background: stateColor } : {}}
            title="Voice input (click to toggle)">
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={isListening ? "🎤 Speak now..." : `Ask ASTRA in ${MODES.find(m => m.id === mode)?.label} mode...`}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all min-w-0" />
          <motion.button whileTap={{ scale: 0.9 }} onClick={send} disabled={!input.trim() || typing}
            className="w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-all"
            style={{ background: `linear-gradient(135deg, ${stateColor}, #7c3aed)` }}>
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
