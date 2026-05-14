import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Map, BookOpen, HelpCircle, ChevronRight, ChevronLeft, Loader2, CheckCircle, User, Clock, Target, Zap } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { id: 0, label: 'Analyzer', icon: Brain, color: '#3b82f6', desc: 'Profile your learning needs' },
  { id: 1, label: 'Roadmap', icon: Map, color: '#10b981', desc: 'Build your study plan' },
  { id: 2, label: 'Resources', icon: BookOpen, color: '#a855f7', desc: 'Curate the best materials' },
  { id: 3, label: 'Quiz', icon: HelpCircle, color: '#f59e0b', desc: 'Test your understanding' },
];

const TOPICS = ['Cybersecurity', 'AI & Machine Learning', 'Blockchain', 'Finance & Markets', 'Web Development', 'Data Science', 'Cloud Computing', 'Soft Skills'];
const LEVELS = ['Complete Beginner', 'Some Basics', 'Intermediate', 'Advanced'];
const STYLES = ['Visual (diagrams & videos)', 'Practical (hands-on)', 'Reading (text & docs)', 'Mixed'];
const GOALS = ['Build a project', 'Pass an exam', 'Career switch', 'General curiosity', 'Interview prep'];

const FALLBACK_RESULTS = {
  analysis: (f: any) => `## 📊 Learning Analysis for ${f.topic}\n\n**Your Profile:**\n- Level: ${f.level}\n- Style: ${f.style}\n- Goal: ${f.goal}\n- Time: ${f.time}\n\n**Knowledge Gap Assessment:**\nBased on your ${f.level} level, you'll need to focus on foundational concepts before advancing.\n\n**Recommended Approach:**\nGiven your ${f.style} preference, start with curated content that matches how you absorb information best.\n\n**Success Metrics:**\nYou'll know you've succeeded when you can explain ${f.topic} in your own words and apply it to a real problem.`,

  roadmap: (f: any) => `## 🗺️ Your ${f.topic} Roadmap\n\n### Phase 1: Foundation (Week 1-2)\n- Core concepts and terminology\n- Basic principles of ${f.topic}\n- Daily 30-minute study sessions\n\n### Phase 2: Development (Week 3-4)\n- Intermediate concepts\n- Practical exercises\n- Mini-project to apply knowledge\n\n### Phase 3: Mastery (Week 5+)\n- Advanced topics\n- Real-world applications\n- Portfolio project\n\n### ⚡ Quick Wins (Day 1)\n1. Watch a 10-minute intro video on ${f.topic}\n2. Read one beginner article\n3. Join a community forum`,

  resources: (f: any) => `## 📚 Curated Resources for ${f.topic}\n\n### Free Resources\n- **YouTube:** Search "${f.topic} for beginners" — tons of free courses\n- **freeCodeCamp.org** — Structured free curriculum\n- **Khan Academy** — Foundational concepts\n- **Reddit r/${f.topic.replace(/\s/g, '')}** — Community insights\n\n### Paid/Premium\n- **Coursera** — University-grade courses ($49/month)\n- **Udemy** — Project-based courses (often $15 during sales)\n\n### Practice Platforms\n- **GitHub** — Build and showcase projects\n- **Kaggle** — Data & AI challenges\n- **HackTheBox** — Cybersecurity labs\n\n### Communities\n- Discord: Search "${f.topic} students"\n- LinkedIn Learning groups`,

  quiz: (topic: string) => [
    { q: `What is the most fundamental concept in ${topic}?`, options: ['Core principles', 'Advanced techniques', 'Industry jargon', 'Historical context'], correct: 0, exp: 'Always start with core principles before advancing.' },
    { q: `Which approach is best for learning ${topic} as a beginner?`, options: ['Jump straight to advanced topics', 'Build foundation first, then advance', 'Skip basics, learn by doing', 'Memorize definitions only'], correct: 1, exp: 'Building a solid foundation prevents confusion later.' },
    { q: `How should you track progress in ${topic}?`, options: ['Count hours studied', 'Build small projects', 'Read more books', 'Watch more videos'], correct: 1, exp: 'Projects demonstrate real understanding and build your portfolio.' },
  ]
};

// --- Advanced Offline Mock Engine ---
const generateMockAnalysis = (f: any) => {
  const intros = [
    `Fantastic choice! ${f.topic} is one of the most in-demand fields right now.`,
    `Diving into ${f.topic}? Great! Let's tailor this specifically to your ${f.goal.toLowerCase()} goal.`,
    `Analyzing your profile for ${f.topic}... As someone starting at the ${f.level} level, we have a clear path forward.`
  ];
  const gapAssessments = {
    'Complete Beginner': `Since you are a complete beginner, the biggest hurdle will be grasping the foundational vocabulary. We'll avoid complex jargon initially.`,
    'Some Basics': `You already have some footing. The gap here is bridging those basic concepts into practical, working knowledge.`,
    'Intermediate': `At the intermediate level, you need to break past the 'tutorial plateau' and focus on advanced architecture and edge cases.`,
    'Advanced': `For an advanced learner, the focus shifts entirely to optimization, enterprise-scale implementation, and deep-dive problem solving.`
  };
  const styleApproaches = {
    'Visual (diagrams & videos)': `Since you are a visual learner, I will prioritize architectural diagrams, YouTube channels, and visual metaphors over heavy text documentation.`,
    'Practical (hands-on)': `You learn by doing. Your roadmap will minimize reading and maximize coding, building, and breaking things in a sandbox.`,
    'Reading (text & docs)': `You prefer deep-dives. We will leverage official documentation, whitepapers, and comprehensive text tutorials.`,
    'Mixed': `We will use a hybrid approach: introducing concepts visually, then immediately applying them practically.`
  };
  const timeCommitment = parseInt(f.time) || 1;
  const pace = timeCommitment > 1 ? "an accelerated pace" : "a steady, manageable pace";

  const randomIntro = intros[Math.floor(Math.random() * intros.length)];
  const gap = gapAssessments[f.level as keyof typeof gapAssessments] || gapAssessments['Some Basics'];
  const style = styleApproaches[f.style as keyof typeof styleApproaches] || styleApproaches['Mixed'];

  return `## 📊 Learning Analysis for ${f.topic}

**Your Profile:**
- **Level:** ${f.level}
- **Style:** ${f.style}
- **Goal:** ${f.goal}
- **Pace:** ${f.time} (${pace})

**Knowledge Gap Assessment:**
${gap}

**Recommended Approach:**
${style} Because your goal is *${f.goal.toLowerCase()}*, we will align every milestone toward that outcome.

**Success Metrics:**
You will know you have succeeded when you can confidently discuss ${f.topic} without relying on external references, and when you achieve your goal of ${f.goal.toLowerCase()}.`;
};

const generateMockRoadmap = (f: any) => {
  const isBeginner = f.level.includes('Beginner') || f.level.includes('Basics');
  const phase1 = isBeginner 
    ? `- Master the core terminology of ${f.topic}\n- Understand the high-level architecture\n- Complete your first "Hello World" equivalent` 
    : `- Review advanced fundamentals of ${f.topic}\n- Identify bad habits to unlearn\n- Setup a professional environment`;
    
  const phase2 = f.style.includes('Practical')
    ? `- Build 3 mini-projects related to ${f.topic}\n- Debug common errors without looking at solutions\n- Apply concepts to your specific goal: ${f.goal}`
    : `- Deep dive into official specifications\n- Study architectural patterns in ${f.topic}\n- Write detailed summaries of core mechanics`;

  const phase3 = `- Capstone project: Address a real-world problem using ${f.topic}\n- Prepare for ${f.goal.toLowerCase()}\n- Share your knowledge with others to solidify understanding`;

  return `## 🗺️ Your Personalized ${f.topic} Roadmap

### Phase 1: Foundation (Weeks 1-2)
${phase1}
- Dedicate your ${f.time} strictly to these core tasks.

### Phase 2: Development (Weeks 3-5)
${phase2}

### Phase 3: Mastery (Weeks 6+)
${phase3}

### ⚡ Quick Wins (Do this today!)
1. Set up your workspace and environment for ${f.topic}.
2. Find one community (Discord/Reddit) focused on ${f.topic} and introduce yourself.
3. Spend 15 minutes mapping out your exact study schedule.`;
};

const generateMockResources = (f: any) => {
  const topicFormat = f.topic.replace(/\s+/g, '').toLowerCase();
  
  let primaryRes = "";
  if (f.style.includes('Visual')) {
    primaryRes = `- **YouTube:** Search "Traversy Media ${f.topic}" or "Fireship ${f.topic}"\n- **Figma/Draw.io:** Create mental maps`;
  } else if (f.style.includes('Practical')) {
    primaryRes = `- **Interactive Labs:** Codecademy or similar interactive platforms\n- **GitHub:** Search for "${f.topic} starter templates"`;
  } else {
    primaryRes = `- **Official Docs:** Always the best source of truth for ${f.topic}\n- **Medium/Dev.to:** Deep-dive technical articles`;
  }

  return `## 📚 Curated Resources for ${f.topic}

### Tailored for ${f.style}
${primaryRes}

### Universal Free Resources
- **freeCodeCamp / Khan Academy:** Search their catalogs for ${f.topic} modules.
- **Reddit:** r/${topicFormat} — Sort by "Top All Time" for the best community advice.
- **Roadmap.sh:** Look for the visual learning path for ${f.topic}.

### Premium Options (Optional)
- **Udemy:** Wait for a $15 sale and buy the highest-rated ${f.topic} course.
- **Coursera:** Look for university-backed specializations in ${f.topic}.`;
};

const generateMockQuiz = (topic: string, level: string) => {
  const isBeginner = level.includes('Beginner');
  
  if (isBeginner) {
    return [
      { q: `What is the primary purpose of ${topic}?`, options: ['To confuse beginners', 'To solve specific industry problems efficiently', 'To replace older technologies completely', 'Just for academic research'], correct: 1, exp: `${topic} was created to solve practical problems in the real world.` },
      { q: `When starting out with ${topic}, what is the biggest mistake?`, options: ['Skipping the fundamentals to build complex things', 'Reading too much documentation', 'Asking for help', 'Taking breaks'], correct: 0, exp: 'Fundamentals are the building blocks. Skipping them leads to frustration later.' },
      { q: `Which of these is a core component of ${topic}?`, options: ['Quantum entanglement', 'Data structures and patterns', 'Photosynthesis', 'Culinary arts'], correct: 1, exp: 'Understanding data flow and patterns is essential in almost all tech fields.' }
    ];
  } else {
    return [
      { q: `In an advanced ${topic} architecture, what is the primary bottleneck?`, options: ['Syntax errors', 'State management and scaling', 'IDE performance', 'Internet speed'], correct: 1, exp: 'At the advanced level, scaling and state synchronization become the hardest problems.' },
      { q: `How do you optimize a complex ${topic} implementation?`, options: ['Rewrite everything from scratch', 'Use profiling tools to identify actual bottlenecks', 'Just add more memory', 'Ignore it if it works'], correct: 1, exp: 'Never guess performance issues. Always measure and profile first.' },
      { q: `What is the best way to handle edge cases in ${topic}?`, options: ['Ignore them', 'Write extensive unit and integration tests', 'Hope users do not encounter them', 'Fix them manually in production'], correct: 1, exp: 'Robust testing is the only professional way to handle edge cases.' }
    ];
  }
};
// ------------------------------------------

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;
  return (
    <div className="space-y-3">
      {text.split('\n').map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-2" />;
        let formattedLine = line;
        
        // Handle headers
        if (formattedLine.startsWith('### ')) {
          return <h4 key={i} className="text-white font-bold mt-4 mb-1 text-sm">{formattedLine.replace('### ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</h4>;
        }
        if (formattedLine.startsWith('## ')) {
          return <h3 key={i} className="text-blue-300 font-bold text-lg mt-5 mb-2 border-b border-white/10 pb-2">{formattedLine.replace('## ', '').replace(/\*\*(.*?)\*\*/g, '$1').replace(/📊|🗺️|📚/g, '')}</h3>;
        }
        if (formattedLine.startsWith('# ')) {
          return <h2 key={i} className="text-white font-bold text-xl mt-6 mb-3">{formattedLine.replace('# ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</h2>;
        }
        
        // Handle lists
        if (formattedLine.startsWith('- ') || formattedLine.startsWith('* ')) {
          formattedLine = formattedLine.substring(2);
          return (
            <div key={i} className="flex gap-2 mb-1 pl-1">
              <span className="text-blue-400 mt-[3px] text-xs">●</span>
              <p className="text-slate-300 text-sm" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
            </div>
          );
        }

        // Handle numbered lists
        const numMatch = formattedLine.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
            return (
              <div key={i} className="flex gap-2 mb-1 pl-1">
                <span className="text-emerald-400 font-bold text-sm">{numMatch[1]}.</span>
                <p className="text-slate-300 text-sm" dangerouslySetInnerHTML={{ __html: numMatch[2].replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
              </div>
            );
        }

        // Handle paragraphs with bold
        return <p key={i} className="text-slate-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedLine.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />;
      })}
    </div>
  );
};

export const StudyAgentWizard: React.FC = () => {
  const [step, setStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<string, any>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [form, setForm] = useState({ topic: '', level: '', style: '', goal: '', time: '1 hour/day' });

  const update = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const runAgent = useCallback(async (agentStep: Step) => {
    setLoading(true);
    let result: any = null;

    if (agentStep === 1) {
      // Offline dynamic generation
      await new Promise(r => setTimeout(r, 1200)); // Simulate thinking
      result = generateMockAnalysis(form);
    } else if (agentStep === 2) {
      await new Promise(r => setTimeout(r, 1500));
      result = generateMockRoadmap(form);
    } else if (agentStep === 3) {
      await new Promise(r => setTimeout(r, 1800));
      const resourceText = generateMockResources(form);
      const quizData = generateMockQuiz(form.topic, form.level);
      result = { resources: resourceText, quiz: quizData };
    }

    setResults(p => ({ ...p, [agentStep]: result }));
    setLoading(false);
    setStep(agentStep as Step);
  }, [form]);

  const chipStyle = (selected: boolean, color = '#3b82f6') => ({
    background: selected ? `${color}25` : 'rgba(255,255,255,0.03)',
    borderColor: selected ? color : 'rgba(255,255,255,0.1)',
    color: selected ? '#fff' : '#94a3b8',
  });

  const quizData = results[3]?.quiz || [];
  const score = quizSubmitted ? quizData.filter((_: any, i: number) => quizAnswers[i] === quizData[i]?.correct).length : 0;

  return (
    <div className="flex flex-col h-[78vh] min-h-[560px] gap-4">
      {/* Step indicators */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.id}>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all ${step >= s.id ? 'text-white' : 'text-slate-500 border-white/10'}`}
              style={step >= s.id ? { background: `${s.color}20`, borderColor: `${s.color}50`, color: s.color } : {}}>
              {results[s.id] || step > s.id ? <CheckCircle size={12} /> : <s.icon size={12} />}
              {s.label}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-slate-600 flex-shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 0: Form */}
          {step === 0 && (
            <motion.div key="form" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-6">
              <div className="bg-slate-900/60 border border-white/10 rounded-2xl p-6">
                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2"><Brain size={18} className="text-blue-400" /> Student Analyzer</h3>
                <p className="text-slate-400 text-sm mb-6">Tell me about yourself and I'll build a personalized 4-agent study plan powered by Gemini AI.</p>

                <div className="space-y-5">
                  <div>
                    <label className="text-slate-300 text-sm font-semibold block mb-2">📚 What do you want to learn?</label>
                    <div className="flex flex-wrap gap-2">
                      {TOPICS.map(t => (
                        <button key={t} onClick={() => update('topic', t)} className="px-3 py-1.5 rounded-xl border text-sm transition-all" style={chipStyle(form.topic === t, '#3b82f6')}>{t}</button>
                      ))}
                    </div>
                    <input value={form.topic} onChange={e => update('topic', e.target.value)} placeholder="Or type your own topic..."
                      className="mt-2 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500/50 placeholder-slate-600" />
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-semibold block mb-2"><User size={14} className="inline mr-1" />Your current level</label>
                    <div className="flex flex-wrap gap-2">
                      {LEVELS.map(l => <button key={l} onClick={() => update('level', l)} className="px-3 py-1.5 rounded-xl border text-sm transition-all" style={chipStyle(form.level === l, '#10b981')}>{l}</button>)}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-semibold block mb-2"><Zap size={14} className="inline mr-1" />How do you learn best?</label>
                    <div className="flex flex-wrap gap-2">
                      {STYLES.map(s => <button key={s} onClick={() => update('style', s)} className="px-3 py-1.5 rounded-xl border text-sm transition-all" style={chipStyle(form.style === s, '#a855f7')}>{s}</button>)}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-semibold block mb-2"><Target size={14} className="inline mr-1" />Your goal</label>
                    <div className="flex flex-wrap gap-2">
                      {GOALS.map(g => <button key={g} onClick={() => update('goal', g)} className="px-3 py-1.5 rounded-xl border text-sm transition-all" style={chipStyle(form.goal === g, '#f59e0b')}>{g}</button>)}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 text-sm font-semibold block mb-2"><Clock size={14} className="inline mr-1" />Time available per day</label>
                    <div className="flex gap-2">
                      {['30 min/day', '1 hour/day', '2 hours/day', '3+ hours/day'].map(t => (
                        <button key={t} onClick={() => update('time', t)} className="px-3 py-1.5 rounded-xl border text-sm transition-all" style={chipStyle(form.time === t, '#06b6d4')}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => runAgent(1)}
                  disabled={!form.topic || !form.level || !form.style || !form.goal || loading}
                  className="mt-6 w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40 transition-all"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #7c3aed)' }}>
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Analyzing with AI...</> : <><Sparkles size={18} /> Run Agent 1: Analyze Me</>}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Analysis result */}
          {step === 1 && results[1] && (
            <motion.div key="analysis" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-4">
              <div className="bg-slate-900/60 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">Agent 1 — Analysis Complete</h3>
                <MarkdownRenderer text={results[1]} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(0)} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white text-sm transition-all"><ChevronLeft size={16} /> Back</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => runAgent(2)} disabled={loading}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Building Roadmap...</> : <><Map size={16} /> Agent 2: Build My Roadmap</>}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Roadmap */}
          {step === 2 && results[2] && (
            <motion.div key="roadmap" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-4">
              <div className="bg-slate-900/60 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-4">Agent 2 — Personalized Roadmap</h3>
                <MarkdownRenderer text={results[2]} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white text-sm transition-all"><ChevronLeft size={16} /> Back</button>
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => runAgent(3)} disabled={loading}
                  className="flex-1 py-2.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #a855f7, #f59e0b)' }}>
                  {loading ? <><Loader2 size={16} className="animate-spin" /> Finding Resources & Generating Quiz...</> : <><BookOpen size={16} /> Agents 3 & 4: Resources + Quiz</>}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Resources + Quiz */}
          {step === 3 && results[3] && (
            <motion.div key="quiz" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
              className="space-y-4">
              {/* Resources */}
              <div className="bg-slate-900/60 border border-purple-500/20 rounded-2xl p-6 mb-4">
                <h3 className="text-purple-400 font-bold text-sm uppercase tracking-widest mb-4">Agent 3 — Curated Resources</h3>
                <MarkdownRenderer text={results[3].resources} />
              </div>

              {/* Quiz */}
              <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-6">
                <h3 className="text-amber-400 font-bold text-sm uppercase tracking-widest mb-4">Agent 4 — Knowledge Quiz</h3>
                {quizSubmitted && (
                  <div className={`mb-4 p-3 rounded-xl border text-sm font-bold flex items-center gap-2 ${score >= quizData.length * 0.7 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                    {score >= quizData.length * 0.7 ? <CheckCircle size={16} /> : <HelpCircle size={16} />}
                    Score: {score}/{quizData.length} — {score >= quizData.length * 0.7 ? '🎉 Excellent! You\'re ready to advance.' : '📖 Review the material and try again.'}
                  </div>
                )}
                <div className="space-y-4">
                  {quizData.map((q: any, qi: number) => (
                    <div key={qi} className="space-y-2">
                      <p className="text-white text-sm font-medium">{qi + 1}. {q.q}</p>
                      <div className="grid grid-cols-1 gap-1.5">
                        {q.options.map((opt: string, oi: number) => {
                          const chosen = quizAnswers[qi] === oi;
                          const correct = q.correct === oi;
                          let cls = 'bg-white/5 border-white/10 text-slate-300';
                          if (quizSubmitted) {
                            if (correct) cls = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300';
                            else if (chosen && !correct) cls = 'bg-red-500/20 border-red-500/50 text-red-300';
                          } else if (chosen) cls = 'bg-blue-500/20 border-blue-500/50 text-white';
                          return (
                            <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(p => ({ ...p, [qi]: oi }))}
                              className={`text-left px-3 py-2 rounded-lg border text-xs transition-all ${cls}`}>
                              {String.fromCharCode(65 + oi)}. {opt}
                            </button>
                          );
                        })}
                      </div>
                      {quizSubmitted && <p className="text-xs text-slate-500 italic pl-2">💡 {q.exp}</p>}
                    </div>
                  ))}
                </div>
                {!quizSubmitted && quizData.length > 0 && (
                  <button onClick={() => setQuizSubmitted(true)}
                    disabled={Object.keys(quizAnswers).length < quizData.length}
                    className="mt-4 w-full py-2.5 rounded-xl font-bold text-white disabled:opacity-40 transition-all"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
                    Submit Quiz
                  </button>
                )}
              </div>

              <button onClick={() => { setStep(0); setResults({}); setQuizAnswers({}); setQuizSubmitted(false); setForm({ topic: '', level: '', style: '', goal: '', time: '1 hour/day' }); }}
                className="w-full py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all">
                Start a New Study Session
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
