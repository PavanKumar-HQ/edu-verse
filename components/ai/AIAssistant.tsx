import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, BookOpen, GraduationCap, Briefcase, Zap, MessageSquare } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const TUTOR_MODES = [
    { id: 'Standard', icon: Sparkles, label: 'Standard' },
    { id: 'ELI10', icon: Zap, label: 'ELI10' },
    { id: 'Compress', icon: MessageSquare, label: 'Compress' },
    { id: 'Analogy', icon: Sparkles, label: 'Analogy' },
    { id: 'ExamPrep', icon: BookOpen, label: 'Exam Prep' },
    { id: 'Interview', icon: Briefcase, label: 'Interview' },
];

export const AIAssistant: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('Standard');
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your Geniusphere AI Tutor. How can I help you today?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);


    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        const txt = input;
        setInput('');
        setIsTyping(true);

        const fallbackResponses: Record<string, string> = {
            'Standard': `Great question about "${txt}"! Here's what you need to know: This topic is fundamental to understanding how modern systems work. Start with the core concept, then explore practical applications. Would you like me to dive deeper into any specific aspect?`,
            'ELI10': `Imagine ${txt} is like a magic box 📦 — it takes something you give it, does something special inside, and gives you back something useful! Cool, right? Want to know what's inside the box?`,
            'Compress': `**${txt} — Core Insight:**\n• What it is: A fundamental concept in the field\n• Why it matters: Enables key functionality\n• Key takeaway: Understanding this unlocks deeper knowledge`,
            'Analogy': `Think of ${txt} like a city's highway system 🛣️ — data flows like cars, servers are destinations, and protocols are the traffic rules. Every element has a specific role to keep things moving!`,
            'ExamPrep': `**Exam Notes: ${txt}**\n\n**Definition:** Core concept...\n**Key Points:**\n• Point 1: Fundamental principle\n• Point 2: Practical application\n• Point 3: Common exam traps\n\n**Likely Question:** How does ${txt} relate to real-world systems?`,
            'Interview': `**Interview Answer for ${txt}:**\n\n*Start:* "${txt} is essentially..."\n*Example:* "In my understanding, a real-world case would be..."\n*Depth:* "The nuance here is..."\n\nThis STAR structure shows both knowledge and communication skills.`,
        };

        try {
            const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
            const modePrompts: Record<string, string> = {
                Standard: `You are a helpful AI tutor. Explain "${txt}" clearly in 3-4 sentences.`,
                ELI10: `Explain "${txt}" to a 10-year-old using a fun analogy. Keep it under 3 sentences.`,
                Compress: `Compress "${txt}" into a 3-bullet micro-summary. Use bold headers.`,
                Analogy: `Give 2 creative real-world analogies for "${txt}". Be specific.`,
                ExamPrep: `Create structured exam notes for "${txt}" with definition, key points, and a sample question.`,
                Interview: `Give an interview-ready answer for "${txt}" using the STAR method. Be concise.`,
            };
            // Offline Mock Engine for AIAssistant
            await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));

            const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
            let reply = "";

            if (mode === 'Standard') {
                reply = pick([
                    `Certainly. ${txt} is essentially a framework designed to streamline complex processes. By standardizing the approach, it minimizes errors and accelerates development.`,
                    `The best way to understand ${txt} is to look at its core components. It acts as an intermediary layer, processing inputs efficiently before passing them downstream.`,
                    `${txt} refers to the systematic methodology used to resolve specific domain problems. It's highly valued for its scalability and robustness.`
                ]);
            } else if (mode === 'ELI10') {
                reply = pick([
                    `Imagine ${txt} is like a super-smart librarian. Instead of you searching the whole library for a book, the librarian just hands it to you instantly!`,
                    `Think of ${txt} like a magic oven. You put raw ingredients (data) in, and it bakes a perfect cake (results) without you having to stir anything!`,
                    `It's like having a walkie-talkie. Instead of running across the playground to tell your friend something, ${txt} beams the message instantly over the air.`
                ]);
            } else if (mode === 'Compress') {
                reply = `### Micro-Summary: ${txt}\n- **Core Mechanism:** Acts as a centralized processing hub.\n- **Primary Benefit:** Reduces redundancy by 40%.\n- **Best Use Case:** High-volume, low-latency environments.`;
            } else if (mode === 'Analogy') {
                reply = `**Analogy 1 (City Planning):** ${txt} is like a city's traffic light system, preventing collisions and keeping flow optimal.\n\n**Analogy 2 (Biology):** It's like the human nervous system, instantly transmitting signals to where they are needed most.`;
            } else if (mode === 'ExamPrep') {
                reply = `**📝 Exam Notes: ${txt}**\n\n**Definition:** A structural pattern used to optimize workflow.\n**Key Points:**\n1. Requires initial setup overhead.\n2. Yields exponential performance gains.\n\n**Sample Question:** "How does ${txt} prevent resource exhaustion in a distributed system?"`;
            } else if (mode === 'Interview') {
                reply = `**Situation:** In my last project, we needed a scalable solution for ${txt}.\n**Task:** We had to implement it without downtime.\n**Action:** I designed a phased rollout strategy.\n**Result:** We achieved a 30% performance boost with zero data loss.`;
            }

            setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
        } catch (error) {
            console.error("Gemini API Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponses[mode] || fallbackResponses['Standard'] }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-[9999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 w-[350px] md:w-[400px] h-[550px] bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm">Geniusphere AI Tutor</h3>
                                    <p className="text-xs text-blue-400">Online & Ready</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-lg text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Mode Selector */}
                        <div className="flex gap-2 p-2 bg-black/20 overflow-x-auto no-scrollbar">
                            {TUTOR_MODES.map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all ${
                                        mode === m.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    <m.icon size={12} />
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Chat Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                        msg.role === 'user' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/5 bg-black/20">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Ask anything..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!input.trim()}
                                    className="absolute right-2 p-2 bg-blue-600 rounded-xl text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Orb Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 p-0.5 shadow-2xl shadow-blue-500/40 relative group"
            >
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                    {/* Animated background glow */}
                    <div className="absolute inset-0 bg-blue-500/20 blur-xl group-hover:bg-blue-500/40 transition-all" />
                    {isOpen ? (
                        <X size={28} className="text-white relative z-10" />
                    ) : (
                        <div className="relative z-10 flex flex-col items-center">
                            <Sparkles size={24} className="text-white animate-pulse" />
                        </div>
                    )}
                </div>
                
                {/* Notification Badge */}
                {!isOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <span className="text-[10px] text-white font-bold">AI</span>
                    </div>
                )}
            </motion.button>
        </div>
    );
};
