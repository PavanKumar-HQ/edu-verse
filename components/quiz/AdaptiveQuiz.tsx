import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Zap, Clock, ChevronRight, Trophy } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
}

interface AdaptiveQuizProps {
  topic?: string;
  onComplete?: (score: number, topic: string) => void;
  onClose?: () => void;
}

const QUESTION_BANK: Question[] = [
  { id: 'q1', text: 'What does CIA stand for in cybersecurity?', options: ['Central Intelligence Agency', 'Confidentiality, Integrity, Availability', 'Code Injection Attack', 'Cloud Infrastructure Audit'], correctIndex: 1, topic: 'Fundamentals', difficulty: 'beginner', explanation: 'The CIA Triad is the core model for information security — ensuring data is kept private, accurate, and accessible.' },
  { id: 'q2', text: 'What is a SQL Injection attack?', options: ['Injecting malware via USB', 'Inserting malicious SQL code into input fields', 'Overloading a server with requests', 'Stealing cookies from a browser'], correctIndex: 1, topic: 'SQL Injection', difficulty: 'beginner', explanation: 'SQL Injection exploits unsanitized inputs to manipulate database queries, potentially exposing or deleting data.' },
  { id: 'q3', text: 'Which protocol ensures secure data transmission over the web?', options: ['FTP', 'HTTP', 'HTTPS/TLS', 'SMTP'], correctIndex: 2, topic: 'Network Security', difficulty: 'beginner', explanation: 'HTTPS uses TLS (Transport Layer Security) to encrypt data in transit, preventing eavesdropping and tampering.' },
  { id: 'q4', text: 'What is a Man-in-the-Middle (MitM) attack?', options: ['Installing a backdoor', 'Intercepting communication between two parties', 'Brute-forcing a password', 'Exploiting a buffer overflow'], correctIndex: 1, topic: 'Network Security', difficulty: 'intermediate', explanation: 'In a MitM attack, an attacker secretly intercepts and possibly alters communication between two parties.' },
  { id: 'q5', text: 'What is the purpose of a firewall?', options: ['Speed up internet connection', 'Filter network traffic based on security rules', 'Encrypt stored data', 'Manage user passwords'], correctIndex: 1, topic: 'Network Defense', difficulty: 'beginner', explanation: 'A firewall monitors and controls incoming/outgoing network traffic based on predetermined security rules.' },
  { id: 'q6', text: 'What does XSS stand for in web security?', options: ['Extended Style Sheets', 'Cross-Site Scripting', 'External Server Script', 'XML Security System'], correctIndex: 1, topic: 'Web Security', difficulty: 'intermediate', explanation: 'XSS allows attackers to inject malicious scripts into web pages viewed by other users.' },
  { id: 'q7', text: 'Which of these is a symmetric encryption algorithm?', options: ['RSA', 'ECC', 'AES', 'Diffie-Hellman'], correctIndex: 2, topic: 'Cryptography', difficulty: 'intermediate', explanation: 'AES (Advanced Encryption Standard) uses the same key for encryption and decryption — making it symmetric.' },
  { id: 'q8', text: 'What is a zero-day vulnerability?', options: ['A vulnerability patched within 24 hours', 'A flaw unknown to the vendor with no available patch', 'A scheduled maintenance window', 'A virus released at midnight'], correctIndex: 1, topic: 'Exploit Dev', difficulty: 'advanced', explanation: 'Zero-days are unknown vulnerabilities that attackers can exploit before the vendor is even aware they exist.' },
  { id: 'q9', text: 'What does OSINT stand for?', options: ['Online Security Intelligence', 'Open Source Intelligence', 'Operational System Integration', 'Offensive Security Internals'], correctIndex: 1, topic: 'Reconnaissance', difficulty: 'intermediate', explanation: 'OSINT uses publicly available information to gather intelligence — a key phase in ethical hacking.' },
  { id: 'q10', text: 'What is the primary function of a VPN?', options: ['Speed up browsing', 'Block all ads', 'Create an encrypted tunnel for data transmission', 'Prevent malware downloads'], correctIndex: 2, topic: 'Network Security', difficulty: 'beginner', explanation: 'A VPN creates an encrypted tunnel between your device and a remote server, protecting data and masking your IP.' },
];

export const AdaptiveQuiz: React.FC<AdaptiveQuizProps> = ({ topic, onComplete, onClose }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const questions = QUESTION_BANK.filter(q => !topic || q.topic === topic || true)
    .sort((a, b) => {
      const order = { beginner: 0, intermediate: 1, advanced: 2 };
      return order[a.difficulty] - order[b.difficulty];
    })
    .slice(0, 5);

  const currentQuestion = questions[currentQ];

  // Timer
  useEffect(() => {
    if (answered || done) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered, done]);

  // Reset timer on new question
  useEffect(() => { setTimeLeft(30); }, [currentQ]);

  const handleAnswer = useCallback((idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === currentQuestion.correctIndex;
    if (correct) setScore(p => p + 1);
    setAnswers(p => [...p, correct]);

    // Adapt difficulty after 2 questions
    if (answers.length >= 1) {
      const recentCorrect = [...answers, correct].slice(-2).filter(Boolean).length;
      if (recentCorrect === 2) setDifficulty('advanced');
      else if (recentCorrect === 1) setDifficulty('intermediate');
      else setDifficulty('beginner');
    }
  }, [answered, currentQuestion, answers]);

  const next = () => {
    if (currentQ + 1 >= questions.length) {
      setDone(true);
      const finalScore = Math.round(((score + (selected === currentQuestion.correctIndex ? 1 : 0)) / questions.length) * 100);
      onComplete?.(finalScore, currentQuestion.topic);
    } else {
      setCurrentQ(p => p + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const finalScore = Math.round((score / questions.length) * 100);

  if (done) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center py-8 px-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${finalScore >= 80 ? 'bg-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.3)]' : finalScore >= 60 ? 'bg-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.3)]' : 'bg-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.3)]'}`}>
          <Trophy size={40} className={finalScore >= 80 ? 'text-emerald-400' : finalScore >= 60 ? 'text-blue-400' : 'text-red-400'} />
        </div>
        <h3 className="text-3xl font-extrabold text-white mb-2">{finalScore}%</h3>
        <p className="text-slate-400 mb-2">{score} / {questions.length} correct</p>
        <p className={`text-sm font-bold mb-6 ${finalScore >= 80 ? 'text-emerald-400' : finalScore >= 60 ? 'text-blue-400' : 'text-red-400'}`}>
          {finalScore >= 80 ? '🏆 Excellent! Difficulty unlocked!' : finalScore >= 60 ? '✅ Good work! Keep pushing.' : '📚 Review recommended. Astra will guide you.'}
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-bold transition-colors">
            Close
          </button>
          <button onClick={() => { setCurrentQ(0); setScore(0); setSelected(null); setAnswered(false); setAnswers([]); setDone(false); }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-colors">
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Progress & Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i < currentQ ? 'bg-emerald-500' : i === currentQ ? 'bg-blue-500' : 'bg-white/10'}`} />
          ))}
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-mono font-bold ${timeLeft <= 10 ? 'text-red-400 bg-red-500/10' : 'text-slate-400 bg-white/5'}`}>
          <Clock size={14} />
          {timeLeft}s
        </div>
      </div>

      {/* Difficulty badge */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' : difficulty === 'intermediate' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
          {difficulty}
        </span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{currentQuestion.topic}</span>
        <span className="ml-auto text-[10px] text-slate-500">Q {currentQ + 1} / {questions.length}</span>
      </div>

      {/* Question */}
      <div className="p-5 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-xl flex-shrink-0"><Brain size={16} className="text-blue-400" /></div>
          <p className="text-white font-medium leading-relaxed">{currentQuestion.text}</p>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {currentQuestion.options.map((opt, i) => {
          const isCorrect = i === currentQuestion.correctIndex;
          const isSelected = i === selected;
          let cls = 'border-white/10 bg-white/5 text-slate-300 hover:border-blue-500/50 hover:bg-blue-500/5 cursor-pointer';
          if (answered) {
            if (isCorrect) cls = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300';
            else if (isSelected && !isCorrect) cls = 'border-red-500/60 bg-red-500/10 text-red-300';
            else cls = 'border-white/5 bg-white/3 text-slate-600 cursor-default';
          }
          return (
            <motion.button key={i} whileHover={!answered ? { x: 4 } : {}} onClick={() => handleAnswer(i)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${cls}`}>
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${answered && isCorrect ? 'bg-emerald-500 text-white' : answered && isSelected ? 'bg-red-500 text-white' : 'bg-white/10'}`}>
                {answered && isCorrect ? <CheckCircle size={14} /> : answered && isSelected && !isCorrect ? <XCircle size={14} /> : String.fromCharCode(65 + i)}
              </span>
              <span className="text-sm">{opt}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation after answer */}
      <AnimatePresence>
        {answered && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Astra Explains</p>
            <p className="text-xs text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {answered && (
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={next}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
          {currentQ + 1 >= questions.length ? 'See Results' : 'Next Question'}
          <ChevronRight size={16} />
        </motion.button>
      )}
    </div>
  );
};
