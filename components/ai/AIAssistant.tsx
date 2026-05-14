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
    { id: 'ExamPrep', icon: BookOpen, label: 'Exam Prep' },
    { id: 'Interview', icon: Briefcase, label: 'Interview' },
    { id: 'QuizMe', icon: GraduationCap, label: 'Quiz Me' },
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
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('http://localhost:5001/api/v1/ai/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    topic: input,
                    mode: mode,
                    context: "Student is currently browsing Geniusphere learning platform."
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                setMessages(prev => [...prev, { role: 'assistant', content: result.data }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "I can't connect to my brain right now. Is the backend running?" }]);
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
