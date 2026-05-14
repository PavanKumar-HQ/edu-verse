import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Play, BookOpen, Zap } from 'lucide-react';

interface Recommendation {
    id?: string;
    course_id?: string;
    title: string;
    reason: string;
    type: 'video' | 'course' | 'lab';
    thumbnailUrl?: string;
    image?: string;
}

export const RecommendedFeed: React.FC<{ userId: string }> = ({ userId }) => {
    const [recs, setRecs] = useState<{ nextBestLesson: Recommendation[], smartRevision: Recommendation[] }>({
        nextBestLesson: [],
        smartRevision: []
    });

    useEffect(() => {
        // Mock data for MVP demo impact
        setRecs({
            nextBestLesson: [
                { course_id: 'c1', title: 'Advanced Neural Networks', reason: 'Based on your AI interest', type: 'course', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500' },
                { id: 'v1', title: 'Zero Trust Security Architecture', reason: 'Next in Cyber Path', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=500' }
            ],
            smartRevision: [
                { id: 'v2', title: 'SQL Injection Fundamentals', reason: 'Mastery Boost (45%)', type: 'video', thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=500' }
            ]
        });
    }, [userId]);

    return (
        <section className="py-12 space-y-8">
            <div className="flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">AI For You</h2>
                        <p className="text-slate-400 text-sm">Personalized learning journey</p>
                    </div>
                </div>
                <button className="text-blue-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                    View All <ArrowRight size={16} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
                {recs.nextBestLesson.map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5 }}
                        className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl"
                    >
                        <div className="aspect-video relative overflow-hidden">
                            <img 
                                src={item.image || item.thumbnailUrl} 
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                            <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600/80 backdrop-blur-md rounded-full text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                                <Zap size={10} /> {item.reason}
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="text-white font-semibold mb-3 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                            <button className="w-full py-3 bg-white/5 hover:bg-blue-600 text-slate-300 hover:text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                                {item.type === 'video' ? <Play size={16} /> : <BookOpen size={16} />}
                                Start Now
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {recs.smartRevision.length > 0 && (
                <div className="px-6">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold">Smart Revision</h4>
                                <p className="text-slate-400 text-sm">Boost your mastery in {recs.smartRevision[0].title}</p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20">
                            Review Now
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};
