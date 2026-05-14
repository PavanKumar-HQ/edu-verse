import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Volume2, VolumeX, ChevronDown } from 'lucide-react';

type Mood = 'idle' | 'listening' | 'thinking' | 'speaking' | 'happy' | 'surprised';
interface Msg { role: 'user' | 'mentor'; text: string; }

const PERSONAS = [
  { id: 'mentor', label: 'Wise Mentor', desc: 'Calm, deep, encouraging', color: '#3b82f6' },
  { id: 'peer', label: 'Study Buddy', desc: 'Casual, fun, relatable', color: '#10b981' },
  { id: 'coach', label: 'Energy Coach', desc: 'High energy, motivating', color: '#f59e0b' },
  { id: 'professor', label: 'Professor', desc: 'Precise, rigorous, academic', color: '#a855f7' },
];

const FALLBACKS: Record<string, (t: string) => string> = {
  mentor: (t) => t.toLowerCase().includes('stuck') ? "Take a breath — confusion is the beginning of wisdom. Tell me exactly where your understanding breaks down, and we'll rebuild it together, brick by brick." : `That's a profound question about "${t}". The key insight most learners miss is that understanding follows from application, not the other way around. What have you tried so far?`,
  peer: (t) => `Omg yes, "${t}" confused me too at first! 😅 The thing that finally made it click for me was thinking about it practically. Have you tried just messing around with a small example? That's how I got it.`,
  coach: (t) => `LET'S GO! You're asking about "${t}" — that means you're ALREADY ahead of 90% of people who just scroll past it! 🔥 Here's the power move: break it into 3 tiny steps, conquer one per day. You've GOT this!`,
  professor: (t) => `An excellent inquiry regarding "${t}". The rigorous approach requires first establishing your epistemological baseline. What is your current formal understanding? We shall identify gaps and address them systematically.`,
};

const offlineGenerator = (text: string, persona: string): string => {
  const t = text.toLowerCase();
  
  // Keyword detection
  const isQuestion = t.includes('?') || t.includes('what') || t.includes('how') || t.includes('why');
  const isStuck = t.includes('stuck') || t.includes('confused') || t.includes('error') || t.includes('help');
  const isGreeting = t.includes('hi ') || t.includes('hello') || t.includes('hey');
  const isMotivation = t.includes('tired') || t.includes('give up') || t.includes('hard') || t.includes('motivate');
  const isQuiz = t.includes('quiz') || t.includes('test me');

  // Randomizer utility
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const templates: Record<string, Record<string, string[]>> = {
    mentor: {
      stuck: [
        "Take a deep breath. Complexity is just layered simplicity. What specific part feels overwhelming?",
        "It's completely normal to hit a wall here. Let's trace it back to the last thing that made sense.",
        "Frustration is the feeling of learning happening. Break the problem in half — which half is causing the error?"
      ],
      question: [
        `That's a very perceptive question about ${text}. The core mechanism relies on foundation principles. Have you tried visualizing it?`,
        "Excellent inquiry. The answer lies in how the underlying systems interact. What is your hypothesis?",
        "I love that question. Rather than just giving you the answer, consider the inverse: what happens if you remove it entirely?"
      ],
      motivate: [
        "You are building mental architecture that will last a lifetime. Do not rush the foundation.",
        "Remember why you started. Every expert was once exactly where you are right now.",
        "Rest if you must, but do not quit. You are closer to the breakthrough than you realize."
      ],
      default: [
        "I'm analyzing your approach. Can you elaborate slightly on that?",
        "Fascinating. How do you see that applying to a real-world scenario?",
        "I'm here to guide you. Let's unpack that thought further."
      ]
    },
    peer: {
      stuck: [
        "Omg yes, I hated this part too! 😅 What usually works for me is just console logging everything.",
        "Don't worry, everyone gets stuck here. Want to try stepping through it line by line together?",
        "Ah yeah, that's a classic trap. Usually it's a tiny typo somewhere. Take a 5 min break!"
      ],
      question: [
        "Oh, good question! Basically, it's just a fancy way of organizing data. Makes sense?",
        `I had to Google ${text} so many times! Think of it like a filing cabinet for your code.`,
        "Honestly, the easiest way to understand it is to just build a tiny 10-line project using it."
      ],
      motivate: [
        "You got this!! 🔥 Take a break, grab some water, and come back. It'll click, I promise.",
        "Dude, learning is hard. But you're already doing better than anyone who didn't try today!",
        "Don't stress! Even senior devs copy-paste and get errors all day long. 🚀"
      ],
      default: [
        "Totally agree. What are you going to tackle next?",
        "Makes sense to me! Any other tricky stuff you want to look at?",
        "Cool! Have you tried running it to see what happens?"
      ]
    },
    coach: {
      stuck: [
        "OBSTACLE DETECTED! 🛑 This is where the growth happens! Step 1: Delete the last thing you wrote. Step 2: Breathe. Step 3: Go again!",
        "Stuck? GOOD! That means you're pushing your limits! Identify the EXACT line causing the issue and attack it!",
        "NO RETREATING! ⚔️ Break it down into 3 microscopic steps. What is step 1?"
      ],
      question: [
        `GREAT QUESTION! ${text} is a power-tool in your arsenal. The best way to learn it is to BREAK it!`,
        "Questions mean you're engaged! The answer is: Execution. Build a prototype right now and see what it does!",
        "I could give you the theory, but champions learn by doing. Go implement it and tell me the result! 🏆"
      ],
      motivate: [
        "WAKE UP! You didn't come this far to only come this far! LET'S GO! 🔥",
        "Fatigue is just weakness leaving your brain! Push through this last concept, you're almost there! ⚡",
        "Discipline > Motivation! Do it even when it's hard. That's how you win! 🥇"
      ],
      default: [
        "I hear you! Now turn that thought into ACTION!",
        "Keep that momentum going! What's the next objective?",
        "Understood! Ready for the next challenge? Let's go!"
      ]
    },
    professor: {
      stuck: [
        "Let us examine the error methodically. Empirical observation of the stack trace is your first step.",
        "Confusion indicates a gap in the theoretical model. Let us review the primary documentation.",
        "I recommend stepping away to review the foundational axioms before re-engaging with the practical application."
      ],
      question: [
        `Your inquiry regarding ${text} is quite valid. Historically, this paradigm was introduced to solve scaling inefficiencies.`,
        "A rigorous question. The literature suggests that the optimal approach is highly context-dependent. Let us analyze your context.",
        "To answer that comprehensively, we must first establish the epistemological baseline of the framework you are utilizing."
      ],
      motivate: [
        "Academic rigor requires persistence. Intellectual stamina is built through these exact challenges.",
        "Do not be discouraged. The mastery of complex systems is an iterative and time-consuming process.",
        "The pursuit of knowledge is a marathon, not a sprint. Maintain your methodical approach."
      ],
      default: [
        "An interesting observation. Please continue your analysis.",
        "I concur. How does this integrate with the broader curriculum?",
        "Noted. Let us proceed to the next module when you are ready."
      ]
    }
  };

  const pTemplate = templates[persona] || templates.mentor;

  if (isGreeting) return pick(["Hello! How can I assist your learning today?", "Greetings. Ready to dive into the material?", "Hey! What's on the agenda for today?"]);
  if (isQuiz) return `Alright, pop quiz! Explain the core concept of what you're learning right now in one sentence. (Don't worry, there are no grades here!)`;
  if (isStuck) return pick(pTemplate.stuck);
  if (isMotivation) return pick(pTemplate.motivate);
  if (isQuestion) return pick(pTemplate.question);
  
  return pick(pTemplate.default);
};

async function getAIReply(text: string, persona: string, history: Msg[]): Promise<string> {
  // Offline mock delay
  await new Promise(r => setTimeout(r, 1200 + Math.random() * 1000));
  return offlineGenerator(text, persona);
}

// ─── Human-like Avatar SVG ─────────────────────────────────────────────────
const HumanAvatar: React.FC<{ mood: Mood; color: string }> = ({ mood, color }) => {
  const blinkVariants = { open: { scaleY: 1 }, closed: { scaleY: 0.05 } };
  const mouthMap: Record<Mood, string> = {
    idle: 'M 38 68 Q 50 72 62 68',
    listening: 'M 38 67 Q 50 71 62 67',
    thinking: 'M 40 68 Q 50 66 60 68',
    speaking: 'M 38 65 Q 50 76 62 65',
    happy: 'M 36 65 Q 50 78 64 65',
    surprised: 'M 44 64 Q 50 74 56 64',
  };

  return (
    <svg width="200" height="260" viewBox="0 0 100 130" className="drop-shadow-2xl">
      <defs>
        <radialGradient id="skinGrad" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fcd7aa" />
          <stop offset="100%" stopColor="#e8a87c" />
        </radialGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="irisGrad" cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background glow */}
      <motion.circle cx="50" cy="55" r="48" fill="url(#glowGrad)"
        animate={{ r: mood === 'speaking' ? [48, 52, 48] : [48, 49, 48] }}
        transition={{ duration: mood === 'speaking' ? 0.4 : 2, repeat: Infinity }} />

      {/* Neural ring */}
      {(mood === 'thinking' || mood === 'speaking') && (
        <motion.circle cx="50" cy="55" r="46" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="4 3"
          animate={{ rotate: mood === 'thinking' ? 360 : -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} />
      )}

      {/* Neck */}
      <rect x="43" y="94" width="14" height="16" rx="4" fill="#e8a87c" />

      {/* Shoulders / Body */}
      <path d="M 10 125 Q 10 108 25 105 L 40 100 Q 50 97 60 100 L 75 105 Q 90 108 90 125 Z" fill={`${color}cc`} />
      {/* Collar */}
      <path d="M 40 100 Q 50 112 60 100" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" fill="none" />

      {/* Head */}
      <ellipse cx="50" cy="55" rx="26" ry="28" fill="url(#skinGrad)" />

      {/* Hair */}
      <path d="M 24 44 Q 26 20 50 22 Q 74 20 76 44 Q 70 28 50 30 Q 30 28 24 44 Z" fill="#1a1a2e" />
      <path d="M 24 44 Q 20 50 24 60 Q 22 50 26 46 Z" fill="#1a1a2e" />
      <path d="M 76 44 Q 80 50 76 60 Q 78 50 74 46 Z" fill="#1a1a2e" />

      {/* Eyebrows */}
      <motion.path d="M 34 42 Q 40 40 46 42" stroke="#6b4c2a" strokeWidth="1.8" fill="none" strokeLinecap="round"
        animate={{ d: mood === 'surprised' ? 'M 34 39 Q 40 37 46 39' : mood === 'thinking' ? 'M 34 43 Q 40 41 44 44' : 'M 34 42 Q 40 40 46 42' }}
        transition={{ duration: 0.3 }} />
      <motion.path d="M 54 42 Q 60 40 66 42" stroke="#6b4c2a" strokeWidth="1.8" fill="none" strokeLinecap="round"
        animate={{ d: mood === 'surprised' ? 'M 54 39 Q 60 37 66 39' : mood === 'thinking' ? 'M 56 44 Q 60 41 66 43' : 'M 54 42 Q 60 40 66 42' }}
        transition={{ duration: 0.3 }} />

      {/* Eye whites */}
      <ellipse cx="40" cy="50" rx="7" ry="7" fill="white" />
      <ellipse cx="60" cy="50" rx="7" ry="7" fill="white" />

      {/* Iris */}
      <motion.ellipse cx="40" cy="50" rx="4.5" ry="4.5" fill="url(#irisGrad)"
        animate={{ cx: mood === 'thinking' ? [40, 43, 40] : 40, ry: mood === 'speaking' ? 4.5 : 4.5 }}
        transition={{ duration: 1.5, repeat: mood === 'thinking' ? Infinity : 0 }} />
      <motion.ellipse cx="60" cy="50" rx="4.5" ry="4.5" fill="url(#irisGrad)"
        animate={{ cx: mood === 'thinking' ? [60, 63, 60] : 60 }}
        transition={{ duration: 1.5, repeat: mood === 'thinking' ? Infinity : 0 }} />

      {/* Pupils */}
      <circle cx="40" cy="50" r="2.2" fill="#0f0f1a" />
      <circle cx="60" cy="50" r="2.2" fill="#0f0f1a" />
      <circle cx="41" cy="49" r="0.8" fill="white" opacity="0.8" />
      <circle cx="61" cy="49" r="0.8" fill="white" opacity="0.8" />

      {/* Eyelids (blink) */}
      <motion.ellipse cx="40" cy="50" rx="7" ry="7" fill="#fcd7aa"
        variants={blinkVariants}
        animate={mood === 'idle' ? ['open', 'closed', 'open'] : 'open'}
        transition={{ duration: 0.12, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 3.5 }} />
      <motion.ellipse cx="60" cy="50" rx="7" ry="7" fill="#fcd7aa"
        variants={blinkVariants}
        animate={mood === 'idle' ? ['open', 'closed', 'open'] : 'open'}
        transition={{ duration: 0.12, times: [0, 0.5, 1], repeat: Infinity, repeatDelay: 3.5 }} />

      {/* Nose */}
      <path d="M 49 55 Q 47 62 45 64 Q 50 66 55 64 Q 53 62 51 55 Z" fill="rgba(0,0,0,0.08)" />

      {/* Lips */}
      <motion.path
        d={mouthMap[mood]}
        stroke="#c47e5a"
        strokeWidth="2"
        fill={mood === 'speaking' || mood === 'happy' || mood === 'surprised' ? 'rgba(180,80,60,0.3)' : 'none'}
        strokeLinecap="round"
        animate={{ d: mood === 'speaking' ? [mouthMap.speaking, mouthMap.idle, mouthMap.speaking] : mouthMap[mood] }}
        transition={{ duration: 0.3, repeat: mood === 'speaking' ? Infinity : 0 }}
      />

      {/* Cheeks */}
      {(mood === 'happy' || mood === 'speaking') && (
        <>
          <ellipse cx="33" cy="63" rx="6" ry="3" fill="#ff9999" opacity="0.3" />
          <ellipse cx="67" cy="63" rx="6" ry="3" fill="#ff9999" opacity="0.3" />
        </>
      )}

      {/* Ear */}
      <ellipse cx="24" cy="55" rx="4" ry="6" fill="#e8a87c" />
      <ellipse cx="76" cy="55" rx="4" ry="6" fill="#e8a87c" />

      {/* Holographic badge */}
      <rect x="35" y="105" width="30" height="14" rx="4" fill={`${color}30`} stroke={`${color}60`} strokeWidth="0.8" />
      <text x="50" y="115" textAnchor="middle" fill={color} fontSize="5" fontWeight="bold" fontFamily="monospace">ZARA AI</text>
    </svg>
  );
};

// ─── Waveform ──────────────────────────────────────────────────────────────
const Waveform: React.FC<{ active: boolean; color: string }> = ({ active, color }) => (
  <div className="flex items-center justify-center gap-0.5 h-8">
    {[...Array(16)].map((_, i) => (
      <motion.div key={i} className="w-1 rounded-full" style={{ background: color }}
        animate={active ? { height: [4, Math.random() * 24 + 4, 4] } : { height: 4 }}
        transition={{ duration: 0.3 + Math.random() * 0.3, repeat: active ? Infinity : 0, delay: i * 0.04 }} />
    ))}
  </div>
);

export const HoloMentorAvatar: React.FC = () => {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: 'mentor', text: "Hey there! I'm ZARA — your holographic AI mentor. I can teach, motivate, quiz, and guide you. What's on your mind today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [mood, setMood] = useState<Mood>('idle');
  const [persona, setPersona] = useState('mentor');
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [showPersonas, setShowPersonas] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recRef = useRef<any>(null);

  const currentPersona = PERSONAS.find(p => p.id === persona) || PERSONAS[0];

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const speak = useCallback((text: string) => {
    if (!ttsEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text.replace(/[*#_`]/g, '').slice(0, 300));
    utt.rate = 1.0; utt.pitch = 1.15;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female'));
    if (preferred) utt.voice = preferred;
    utt.onstart = () => setMood('speaking');
    utt.onend = () => setMood('idle');
    window.speechSynthesis.speak(utt);
  }, [ttsEnabled]);

  const toggleListen = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setInput("🎤 Voice not supported — please type below."); return; }
    if (isListening) { recRef.current?.stop(); setIsListening(false); setMood('idle'); return; }
    const rec = new SR();
    rec.lang = 'en-US'; rec.continuous = false; rec.interimResults = true;
    rec.onstart = () => { setIsListening(true); setMood('listening'); };
    rec.onresult = (e: any) => setInput(Array.from(e.results).map((r: any) => r[0].transcript).join(''));
    rec.onerror = (e: any) => {
      setIsListening(false); setMood('idle');
      if (e.error === 'not-allowed') setInput("🎤 Mic blocked — check browser permissions.");
    };
    rec.onend = () => { setIsListening(false); setMood('idle'); };
    recRef.current = rec;
    rec.start();
  }, [isListening]);

  const send = useCallback(async () => {
    if (!input.trim() || typing) return;
    const txt = input.trim();
    setMsgs(p => [...p, { role: 'user', text: txt }]);
    setInput('');
    setTyping(true);
    setMood('thinking');
    window.speechSynthesis?.cancel();
    const reply = await getAIReply(txt, persona, msgs);
    setMsgs(p => [...p, { role: 'mentor', text: reply }]);
    setTyping(false);
    setMood('happy');
    setTimeout(() => speak(reply), 100);
    setTimeout(() => setMood('idle'), 4000);
  }, [input, typing, persona, msgs, speak]);

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[78vh] min-h-[560px]">
      {/* Avatar Panel */}
      <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-3">
        {/* Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center rounded-3xl border border-white/10 relative overflow-hidden"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${currentPersona.color}25, #020617 70%)` }}>
          {/* Animated rings */}
          {[80, 100, 120].map((r, i) => (
            <motion.div key={r} className="absolute rounded-full border opacity-10"
              style={{ width: r * 2, height: r * 2, borderColor: currentPersona.color }}
              animate={{ scale: [1, 1.04, 1], opacity: [0.08, 0.04, 0.08] }}
              transition={{ duration: 2 + i * 0.8, repeat: Infinity, delay: i * 0.4 }} />
          ))}

          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10">
            <HumanAvatar mood={mood} color={currentPersona.color} />
          </motion.div>

          {/* Name & Status */}
          <div className="relative z-10 text-center mt-1 mb-3">
            <p className="text-white font-bold text-base">ZARA</p>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: currentPersona.color }}>
              {mood === 'idle' ? `${currentPersona.label} Mode` :
               mood === 'listening' ? '🎤 Listening...' :
               mood === 'thinking' ? '⚡ Thinking...' :
               mood === 'speaking' ? '🔊 Speaking...' : '😊 Ready'}
            </p>
          </div>

          {/* Waveform */}
          <div className="relative z-10 w-full px-6 pb-3">
            <Waveform active={isListening || mood === 'speaking'} color={currentPersona.color} />
          </div>
        </div>

        {/* Persona Selector */}
        <div className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden">
          <button onClick={() => setShowPersonas(p => !p)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-sm"
            style={{ color: currentPersona.color }}>
            <span className="font-bold">{currentPersona.label}</span>
            <ChevronDown size={14} className={`transition-transform ${showPersonas ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {showPersonas && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                {PERSONAS.map(p => (
                  <button key={p.id} onClick={() => { setPersona(p.id); setShowPersonas(false); }}
                    className={`w-full px-4 py-2 flex items-center gap-3 text-sm transition-all hover:bg-white/5 ${persona === p.id ? 'bg-white/5' : ''}`}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
                    <div className="text-left">
                      <p className="text-white text-xs font-medium">{p.label}</p>
                      <p className="text-slate-500 text-[10px]">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button onClick={toggleListen}
            className={`flex-1 py-2 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${isListening ? 'text-white animate-pulse' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
            style={isListening ? { background: currentPersona.color, borderColor: currentPersona.color } : {}}>
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            {isListening ? 'Stop' : 'Voice'}
          </button>
          <button onClick={() => { setTtsEnabled(p => !p); if (ttsEnabled) window.speechSynthesis?.cancel(); }}
            className={`flex-1 py-2 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 transition-all ${ttsEnabled ? 'text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
            style={ttsEnabled ? { background: `${currentPersona.color}30`, borderColor: `${currentPersona.color}50`, color: currentPersona.color } : {}}>
            {ttsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {ttsEnabled ? 'Voice On' : 'Voice Off'}
          </button>
        </div>
      </div>

      {/* Chat Panel */}
      <div className="flex-1 flex flex-col bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
        <div className="flex-shrink-0 px-5 py-3 border-b border-white/5 flex items-center justify-between"
          style={{ background: `${currentPersona.color}12` }}>
          <div>
            <p className="text-white font-bold text-sm">ZARA — {currentPersona.label}</p>
            <p className="text-[10px] text-slate-500">{currentPersona.desc} · Powered by Gemini AI</p>
          </div>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: currentPersona.color }} />
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
          <AnimatePresence>
            {msgs.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {m.role === 'mentor' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: currentPersona.color }}>Z</div>
                )}
                <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' ? 'text-white rounded-br-sm' : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm'
                }`} style={m.role === 'user' ? { background: `linear-gradient(135deg, ${currentPersona.color}, #7c3aed)` } : {}}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: currentPersona.color }}>Z</div>
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: currentPersona.color }}
                      animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endRef} />
        </div>

        {/* Quick prompts */}
        <div className="flex-shrink-0 px-5 py-2 flex gap-2 overflow-x-auto">
          {["Explain this simply", "Quiz me!", "I'm struggling", "Motivate me", "What should I study?"].map((s, i) => (
            <button key={i} onClick={() => setInput(s)}
              className="flex-shrink-0 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] text-slate-400 hover:text-white transition-all whitespace-nowrap">
              {s}
            </button>
          ))}
        </div>

        <div className="flex-shrink-0 p-4 border-t border-white/5 bg-black/20 flex gap-2">
          <button onClick={toggleListen}
            className={`w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center transition-all ${isListening ? 'text-white animate-pulse' : 'bg-white/5 text-slate-400 hover:text-white'}`}
            style={isListening ? { background: currentPersona.color } : {}}>
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={isListening ? "🎤 Speak now..." : "Ask ZARA anything..."}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all" />
          <motion.button whileTap={{ scale: 0.9 }} onClick={send} disabled={!input.trim() || typing}
            className="w-11 h-11 flex-shrink-0 rounded-xl flex items-center justify-center text-white disabled:opacity-30 transition-all"
            style={{ background: `linear-gradient(135deg, ${currentPersona.color}, #7c3aed)` }}>
            <Send size={18} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};
