import React from 'react';
import { motion } from 'framer-motion';

export const DNASphere: React.FC = () => {
    return (
        <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-full">
            {/* Outer Rotating Rings */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-blue-500/20 rounded-full"
            />
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-[1px] border-cyan-500/10 rounded-full border-dashed"
            />

            {/* Neural Connections (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-40">
                <defs>
                    <linearGradient id="neuralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00FFFF" stopOpacity="0.2" />
                        <stop offset="50%" stopColor="#BD00FF" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#0047FF" stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                <motion.circle
                    cx="50%" cy="50%" r="35%"
                    fill="none"
                    stroke="url(#neuralGrad)"
                    strokeWidth="2"
                    strokeDasharray="10 5"
                    animate={{ 
                        strokeDashoffset: [0, 50],
                        scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* Core Neural Orb */}
            <div className="relative w-1/2 h-1/2">
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-cyan-400 to-purple-600 rounded-full blur-2xl"
                />
                <div className="relative w-full h-full bg-slate-900/40 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center overflow-hidden">
                    {/* Interior Particles */}
                    {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ 
                                x: [0, Math.random() * 40 - 20, 0],
                                y: [0, Math.random() * 40 - 20, 0],
                                opacity: [0.2, 0.6, 0.2]
                            }}
                            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
                            className="absolute w-2 h-2 bg-white rounded-full blur-[1px]"
                            style={{ 
                                left: `${Math.random() * 80 + 10}%`,
                                top: `${Math.random() * 80 + 10}%`
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Data Streams */}
            <div className="absolute inset-0 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={`stream-${i}`}
                        animate={{ 
                            rotate: [0, 360],
                            opacity: [0, 0.3, 0]
                        }}
                        transition={{ duration: 10, repeat: Infinity, delay: i * 2 }}
                        className="absolute inset-0 border-t border-cyan-400/30 rounded-full"
                    />
                ))}
            </div>
        </div>
    );
};
