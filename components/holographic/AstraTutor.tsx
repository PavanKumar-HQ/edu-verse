import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Target, Zap, Shield, Smile, Globe, Sparkles, X, Send, Maximize2, Mic, MicOff, FileText, Languages, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

type Mode = 'mentor' | 'quiz' | 'simplify' | 'rescue' | 'motivation' | 'analogy' | 'interview' | 'flashcards' | 'translate';
type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'celebrating';
interface Msg { role: 'astra' | 'user'; text: string; }

// ── Fallback intelligence (works without any API) ───────────────────────────
const FALLBACK: Record<Mode, (t: string) => string> = {
  mentor: (t) => t.toLowerCase().includes('stuck')
    ? "Let's break this down step-by-step. Which specific concept lost you? I'll reroute your path!"
    : `Great question! For "${t}", I'd start with the core fundamentals → build a mini-project → then tackle edge cases. What's your current level?`,
  quiz: () => "❓ **Quick Quiz:**\nWhat does 'CIA' stand for in cybersecurity?\nA) Central Intelligence Agency\nB) Confidentiality, Integrity, Availability ✓\nC) Code Injection Attack\nD) Cloud Integration API\n\nType A, B, C, or D!",
  simplify: (t) => `Think of ${t || 'this concept'} like a traffic system 🚦 — data packets are cars, routers are traffic lights, firewalls are checkpoints that only approve valid vehicles. Simple, right?`,
  rescue: () => "🆘 Rescue Mode ON! Take a breath. Start with just ONE concept — write it in your own words. That solves 60% of confusion. What's the one thing blocking you right now?",
  motivation: () => "🔥 You're crushing it! Every expert was once a beginner. The fact that you're here, asking questions, means you're already ahead. One more session and you'll level up — I believe in you!",
  analogy: (t) => t.toLowerCase().includes('api')
    ? "An API is like a restaurant waiter — you order (request), the kitchen cooks (server processes), waiter delivers (response). You never see the kitchen!"
    : `A firewall is like a nightclub bouncer — checks IDs, blocks suspicious guests, lets only approved traffic through. ${t ? `Apply that to "${t}" and it clicks!` : ''}`,
  interview: () => "**Interview Q:** 'Describe the OSI model and a real attack vector on it.'\n\nStructure your answer: Layer overview → Which layer is attacked (e.g., Layer 7 for XSS) → Mitigation strategy. Nail this and you'll impress any interviewer!",
  flashcards: () => "🗂️ **AI Flashcards Generated:**\n1. **XSS** → Cross-Site Scripting: inject malicious scripts\n2. **SQLi** → SQL Injection: manipulate database queries\n3. **CSRF** → Cross-Site Request Forgery: trick authenticated users\n4. **MitM** → Man-in-the-Middle: intercept communications\n\nWant me to quiz you on these?",
  translate: () => "🌐 I can explain any concept in multiple styles. Try asking me something and choose a mode: ELI5 (simple), Technical (deep), or Analogy (story-based). Which style clicks for you?",
};

const MODES = [
  { id: 'mentor' as Mode, label: 'Mentor', icon: Brain, color: 'text-blue-400' },
  { id: 'quiz' as Mode, label: 'Quiz', icon: Target, color: 'text-red-400' },
  { id: 'simplify' as Mode, label: 'Simplify', icon: Zap, color: 'text-yellow-400' },
  { id: 'rescue' as Mode, label: 'Rescue', icon: Shield, color: 'text-purple-400' },
  { id: 'motivation' as Mode, label: 'Boost', icon: Smile, color: 'text-emerald-400' },
  { id: 'analogy' as Mode, label: 'Analogy', icon: Globe, color: 'text-pink-400' },
  { id: 'interview' as Mode, label: 'Career', icon: Sparkles, color: 'text-orange-400' },
  { id: 'flashcards' as Mode, label: 'Flash', icon: FileText, color: 'text-cyan-400' },
  { id: 'translate' as Mode, label: 'Global', icon: Languages, color: 'text-indigo-400' },
];

const QUICK_PROMPTS = ["What should I study?", "I'm stuck", "Quiz me", "Motivate me", "Explain with analogy"];

export const AstraTutor: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [full, setFull] = useState(false);
  const [mode, setMode] = useState<Mode>('mentor');
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'astra', text: "Greetings, Voyager! 🧠 I'm ASTRA — your AI mentor powered by Gemini. I'm here 24/7. What shall we conquer today?" }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [aiStatus, setAiStatus] = useState<'online' | 'offline'>('online');
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check capabilities on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
    synthRef.current = window.speechSynthesis || null;
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  // ── Text-to-Speech ───────────────────────────────────────────────────────
  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !synthRef.current) return;
    synthRef.current.cancel();
    const clean = text.replace(/[*#_`]/g, '').slice(0, 300);
    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = 1.05; utt.pitch = 1.1;
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
    if (preferred) utt.voice = preferred;
    utt.onstart = () => { setIsSpeaking(true); setAvatarState('speaking'); };
    utt.onend = () => { setIsSpeaking(false); setAvatarState('idle'); };
    synthRef.current.speak(utt);
  }, [ttsEnabled]);

  // ── Speech-to-Text ───────────────────────────────────────────────────────
  const toggleListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setInput("(Voice not supported in this browser — please type)");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setAvatarState('idle');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onstart = () => { setIsListening(true); setAvatarState('listening'); };
    recognition.onresult = (e: any) => {
      const transcript = Array.from(e.results).map((r: any) => r[0].transcript).join('');
      setInput(transcript);
    };
    recognition.onerror = (e: any) => {
      setIsListening(false);
      setAvatarState('idle');
      if (e.error === 'not-allowed') setInput("🎤 Mic access denied — please allow microphone in browser settings.");
    };
    recognition.onend = () => { setIsListening(false); setAvatarState('idle'); };
    recognitionRef.current = recognition;
    recognition.start();
  }, [isListening]);

  // ── AI Response (Gemini direct + fallback) ───────────────────────────────
  const getAIResponse = useCallback(async (userText: string): Promise<string> => {
    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const modePersonas: Record<Mode, string> = {
          mentor: 'You are ASTRA, a wise and encouraging AI mentor on Geniusphere learning platform. Be concise (3-4 sentences), insightful, and motivating.',
          quiz: 'You are ASTRA quiz mode. Generate 1 multiple-choice question on the topic with 4 options. Mark the correct one with ✓.',
          simplify: 'You are ASTRA simplify mode. Explain the concept using a very simple analogy a 10-year-old would understand. Be brief.',
          rescue: 'You are ASTRA rescue mode. The student is struggling. Provide 3 concrete steps to get unstuck. Be empathetic and actionable.',
          motivation: 'You are ASTRA motivation mode. Deliver a powerful, personalized motivational message. Be energetic and genuine.',
          analogy: 'You are ASTRA analogy mode. Create 2 creative real-world analogies for the concept. Be imaginative.',
          interview: 'You are ASTRA career mode. Give interview-ready advice with STAR structure. Be professional and precise.',
          flashcards: 'You are ASTRA flashcards mode. Generate 5 key term flashcards related to the topic in bold key: definition format.',
          translate: 'You are ASTRA global mode. Explain the concept in 3 different cognitive styles: visual, logical, and narrative.',
        };
        const prompt = `${modePersonas[mode]}\n\nStudent says: "${userText}"\n\nASTRA:`;
        const resp = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        setAiStatus('online');
        return resp.text || FALLBACK[mode](userText);
      } catch {
        setAiStatus('offline');
      }
    } else {
      setAiStatus('offline');
    }
    return FALLBACK[mode](userText);
  }, [mode]);

  const send = useCallback(async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMsgs(p => [...p, { role: 'user', text: userText }]);
    setInput('');
    setTyping(true);
    setAvatarState('thinking');
    synthRef.current?.cancel();
    const reply = await getAIResponse(userText);
    setMsgs(p => [...p, { role: 'astra', text: reply }]);
    setTyping(false);
    setAvatarState('idle');
    speak(reply);
  }, [input, getAIResponse, speak]);

  // ── Avatar SVG ───────────────────────────────────────────────────────────
  const avatarColors: Record<AvatarState, string> = {
    idle: '#3b82f6', listening: '#10b981', thinking: '#a855f7', speaking: '#06b6d4', celebrating: '#f59e0b'
  };
  const color = avatarColors[avatarState];

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button key="orb" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)} className="relative">
            <motion.div animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full" style={{ background: color, filter: 'blur(8px)' }} />
            <div className="w-16 h-16 rounded-full p-[2px] shadow-2xl" style={{ background: `linear-gradient(135deg, ${color}, #7c3aed)` }}>
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                <Brain className="text-cyan-400" size={26} />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: aiStatus === 'online' ? '#10b981' : '#ef4444' }}>
              <span className="text-[8px] text-white font-bold">AI</span>
            </div>
          </motion.button>
        ) : (
          <motion.div key="panel"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className={`${full ? 'fixed inset-4 z-[200] rounded-[2rem]' : 'w-[390px] h-[640px]'} bg-slate-900/98 backdrop-blur-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden`}>

            {/* Header */}
            <div className="flex-shrink-0 p-3 border-b border-white/5 bg-gradient-to-b from-blue-500/10 to-transparent flex items-center gap-3">
              {/* Holographic Avatar */}
              <div className="relative flex-shrink-0">
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <defs>
                    <radialGradient id="ag" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={color} stopOpacity="0.6" />
                      <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="22" cy="22" r="20" fill="url(#ag)" />
                  <motion.circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="1.5"
                    animate={{ r: avatarState === 'speaking' ? [18, 20, 18] : [18, 19, 18] }}
                    transition={{ duration: avatarState === 'speaking' ? 0.4 : 1.5, repeat: Infinity }} />
                  {/* Face */}
                  <circle cx="22" cy="18" r="8" fill="#1e293b" stroke={color} strokeWidth="1" />
                  <motion.ellipse cx="19" cy="17" rx="2" ry={avatarState === 'thinking' ? 1.5 : avatarState === 'listening' ? 2.5 : 2}
                    fill={color} animate={{ ry: [2, avatarState === 'thinking' ? 0.5 : 2.5, 2] }}
                    transition={{ duration: avatarState === 'thinking' ? 0.8 : 2, repeat: Infinity }} />
                  <motion.ellipse cx="25" cy="17" rx="2" ry={2} fill={color}
                    animate={{ ry: [2, avatarState === 'thinking' ? 0.5 : 2.5, 2] }}
                    transition={{ duration: avatarState === 'thinking' ? 0.8 : 2, repeat: Infinity }} />
                  {avatarState === 'speaking' && (
                    <motion.path d="M 18 22 Q 22 25 26 22" stroke={color} strokeWidth="1.5" fill="none"
                      animate={{ d: ["M 18 22 Q 22 25 26 22", "M 18 21 Q 22 24 26 21"] }}
                      transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse' }} />
                  )}
                  {avatarState !== 'speaking' && (
                    <path d="M 18 22 Q 22 24 26 22" stroke={color} strokeWidth="1" fill="none" opacity="0.6" />
                  )}
                  {/* Neural rings */}
                  {[28, 34, 40].map((r, i) => (
                    <motion.circle key={r} cx="22" cy="22" r={r / 2} fill="none" stroke={color} strokeWidth="0.5"
                      animate={{ opacity: avatarState !== 'idle' ? [0.4, 0.1, 0.4] : [0.15, 0.05, 0.15], scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5 + i * 0.5, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">ASTRA AI</p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color }}>
                  {avatarState === 'idle' ? (aiStatus === 'online' ? '● Gemini Active' : '● Fallback Mode') :
                   avatarState === 'listening' ? '🎤 Listening...' :
                   avatarState === 'thinking' ? '⚡ Processing...' : '🔊 Speaking'}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => { if (synthRef.current) { setTtsEnabled(p => !p); if (ttsEnabled) synthRef.current!.cancel(); } }}
                  className={`p-1.5 rounded-lg transition-all ${ttsEnabled ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:bg-white/5'}`}
                  title={ttsEnabled ? "Mute voice" : "Enable voice"}>
                  {ttsEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                </button>
                <button onClick={() => setFull(!full)} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white"><Maximize2 size={13} /></button>
                <button onClick={() => { setOpen(false); synthRef.current?.cancel(); }} className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white"><X size={13} /></button>
              </div>
            </div>

            {/* Waveform when speaking/listening */}
            <AnimatePresence>
              {(isListening || isSpeaking) && (
                <motion.div initial={{ height: 0 }} animate={{ height: 32 }} exit={{ height: 0 }}
                  className="flex-shrink-0 flex items-center justify-center gap-1 overflow-hidden px-4"
                  style={{ background: `${color}15` }}>
                  {[...Array(20)].map((_, i) => (
                    <motion.div key={i} className="w-1 rounded-full" style={{ background: color }}
                      animate={{ height: [4, Math.random() * 20 + 4, 4] }}
                      transition={{ duration: 0.4 + Math.random() * 0.3, repeat: Infinity, delay: i * 0.05 }} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Modes */}
            <div className="flex-shrink-0 p-2 grid grid-cols-5 gap-1 border-b border-white/5 bg-black/20">
              {MODES.map(m => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 rounded-xl border transition-all ${mode === m.id ? 'bg-blue-500/20 border-blue-500/40' : 'border-transparent hover:bg-white/5'}`}>
                  <m.icon size={11} className={m.color} />
                  <span className="text-[8px] font-bold uppercase text-slate-400">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {msgs.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${
                    m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm'
                  }`}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl w-16">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Quick prompts */}
            <div className="flex-shrink-0 px-3 pb-2 flex gap-1.5 overflow-x-auto">
              {QUICK_PROMPTS.map((s, i) => (
                <button key={i} onClick={() => setInput(s)}
                  className="flex-shrink-0 px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-slate-400 hover:text-white transition-all">
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex-shrink-0 p-3 border-t border-white/5 bg-black/20 flex gap-2 items-center">
              <button onClick={toggleListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all flex-shrink-0 ${
                  isListening ? 'text-white animate-pulse' : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
                style={isListening ? { background: color } : {}}
                title={speechSupported ? (isListening ? "Stop listening" : "Voice input") : "Voice not supported — type instead"}>
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder={isListening ? "Listening... speak now" : `Ask in ${MODES.find(m => m.id === mode)?.label} mode...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 placeholder:text-slate-600 min-w-0" />
              <motion.button whileTap={{ scale: 0.9 }} onClick={send} disabled={!input.trim() || typing}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center text-white rounded-xl transition-all disabled:opacity-30"
                style={{ background: `linear-gradient(135deg, ${color}, #7c3aed)` }}>
                <Send size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
