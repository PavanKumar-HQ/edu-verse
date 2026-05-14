import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, Zap, Target, Star, Lock, Globe } from 'lucide-react';

const PLANETS = [
    { id: 'p1', name: 'Cyber Citadel', icon: Shield, x: 20, y: 30, color: 'emerald', unlocked: true, level: 5 },
    { id: 'p2', name: 'Neural Nexus', icon: Brain, x: 50, y: 60, color: 'blue', unlocked: true, level: 3 },
    { id: 'p3', name: 'Fintech Forge', icon: Zap, x: 80, y: 20, color: 'orange', unlocked: true, level: 1 },
    { id: 'p4', name: 'Quantum Core', icon: Target, x: 30, y: 80, color: 'red', unlocked: false, level: 0 },
    { id: 'p5', name: 'Z-Trust Zenith', icon: Globe, x: 70, y: 85, color: 'purple', unlocked: false, level: 0 },
];

export const GalaxyMap: React.FC = () => {
    return (
        <div className="relative w-full h-[600px] bg-slate-950/50 backdrop-blur-3xl border border-white/5 rounded-[40px] p-8 overflow-hidden">
            {/* Space Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(50)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                        transition={{ duration: Math.random() * 5 + 2, repeat: Infinity, delay: Math.random() * 5 }}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                    />
                ))}
            </div>

            <div className="relative z-10 mb-8 flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Globe size={24} className="text-blue-400" />
                        Learning Galaxy
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">Explore simulation planets and unlock new horizons</p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Rank</span>
                        <span className="text-white font-bold">Galaxy Explorer III</span>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400">
                        <Star size={20} />
                    </div>
                </div>
            </div>

            {/* Map Canvas */}
            <div className="relative w-full h-[400px]">
                {/* SVG Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                    <line x1="20%" y1="30%" x2="50%" y2="60%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="50%" y1="60%" x2="80%" y2="20%" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5,5" />
                </svg>

                {PLANETS.map((planet) => (
                    <motion.div
                        key={planet.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        className="absolute cursor-pointer group"
                        style={{ left: `${planet.x}%`, top: `${planet.y}%`, transform: 'translate(-50%, -50%)' }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                                planet.unlocked 
                                ? `bg-${planet.color}-500/20 border border-${planet.color}-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]` 
                                : 'bg-slate-900 border border-white/5 opacity-50'
                            }`}>
                                {planet.unlocked ? (
                                    <planet.icon size={24} className={`text-${planet.color}-400 group-hover:scale-110 transition-transform`} />
                                ) : (
                                    <Lock size={20} className="text-slate-600" />
                                )}

                                {/* Orbital Ring for unlocked planets */}
                                {planet.unlocked && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                        className={`absolute inset-[-10px] border border-${planet.color}-500/20 rounded-full border-t-${planet.color}-500/50`}
                                    />
                                )}
                            </div>
                            <div className="text-center">
                                <span className={`text-[10px] font-bold block ${planet.unlocked ? 'text-white' : 'text-slate-600'}`}>{planet.name}</span>
                                {planet.unlocked && (
                                    <span className="text-[8px] text-slate-500 uppercase tracking-tighter">LVL {planet.level} Mastery</span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Bottom Legend */}
            <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" /> Stable
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                        <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" /> Anomalies
                    </div>
                </div>
                <button className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-slate-400 hover:text-white text-[10px] font-bold uppercase tracking-widest transition-all">
                    System Scan
                </button>
            </div>
        </div>
    );
};
