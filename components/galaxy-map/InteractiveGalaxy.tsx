import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Shield, Target, Globe } from 'lucide-react';

interface Planet {
    id: string;
    name: string;
    type: 'tech' | 'finance' | 'prof';
    size: number;
    orbitRadius: number;
    orbitDuration: number;
    color: string;
    description: string;
    status: 'locked' | 'unlocked' | 'mastered';
}

const PLANETS: Planet[] = [
    {
        id: 'tech',
        name: 'Cyber Citadel',
        type: 'tech',
        size: 80,
        orbitRadius: 180,
        orbitDuration: 40,
        color: '#00FFFF',
        description: 'Master the arts of defense and ethical hacking.',
        status: 'mastered'
    },
    {
        id: 'ai',
        name: 'Neural Nexus',
        type: 'tech',
        size: 100,
        orbitRadius: 280,
        orbitDuration: 60,
        color: '#BD00FF',
        description: 'The core of artificial intelligence and machine learning.',
        status: 'unlocked'
    },
    {
        id: 'finance',
        name: 'Capital Core',
        type: 'finance',
        size: 90,
        orbitRadius: 400,
        orbitDuration: 80,
        color: '#00FF94',
        description: 'Fintech, markets, and the future of global economy.',
        status: 'unlocked'
    },
    {
        id: 'prof',
        name: 'Synergy Station',
        type: 'prof',
        size: 70,
        orbitRadius: 520,
        orbitDuration: 100,
        color: '#FFD600',
        description: 'Professional excellence and leadership mastery.',
        status: 'locked'
    }
];

export const InteractiveGalaxy: React.FC<{ onPlanetClick: (id: string) => void }> = ({ onPlanetClick }) => {
    const [hoveredPlanet, setHoveredPlanet] = useState<Planet | null>(null);

    return (
        <div className="relative w-full h-[600px] overflow-hidden bg-black/20 rounded-[3rem] border border-white/5 backdrop-blur-sm cursor-move">
            {/* Sun / Core */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"
                />
                <div className="relative w-16 h-16 bg-white/10 rounded-full border border-white/20 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                    <Globe className="text-blue-400 animate-pulse" size={32} />
                </div>
            </div>

            {/* Orbit Rings */}
            {PLANETS.map((planet) => (
                <div
                    key={`ring-${planet.id}`}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div 
                        className="border border-white/5 rounded-full"
                        style={{ 
                            width: planet.orbitRadius * 2, 
                            height: planet.orbitRadius * 2 
                        }}
                    />
                </div>
            ))}

            {/* Planets */}
            {PLANETS.map((planet) => (
                <PlanetNode 
                    key={planet.id} 
                    planet={planet} 
                    onHover={setHoveredPlanet}
                    onClick={() => onPlanetClick(planet.id)}
                />
            ))}

            {/* Info Panel */}
            <AnimatePresence>
                {hoveredPlanet && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute top-8 right-8 w-64 p-6 glass-panel border-white/10 rounded-2xl z-50 pointer-events-none"
                    >
                        <h3 className="text-xl font-bold mb-2" style={{ color: hoveredPlanet.color }}>
                            {hoveredPlanet.name}
                        </h3>
                        <p className="text-slate-400 text-sm mb-4">
                            {hoveredPlanet.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                            <span className={hoveredPlanet.status === 'locked' ? 'text-red-400' : 'text-emerald-400'}>
                                Status: {hoveredPlanet.status}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Galaxy Legend */}
            <div className="absolute bottom-8 left-8 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" /> Mastered
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <div className="w-2 h-2 rounded-full bg-blue-400" /> Unlocked
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <div className="w-2 h-2 rounded-full bg-slate-600" /> Locked
                </div>
            </div>
        </div>
    );
};

const PlanetNode: React.FC<{ 
    planet: Planet; 
    onHover: (p: Planet | null) => void;
    onClick: () => void;
}> = ({ planet, onHover, onClick }) => {
    return (
        <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: planet.orbitDuration, repeat: Infinity, ease: "linear" }}
        >
            <div 
                className="relative"
                style={{ transform: `translateX(${planet.orbitRadius}px)` }}
            >
                <motion.div
                    whileHover={{ scale: 1.2 }}
                    onHoverStart={() => onHover(planet)}
                    onHoverEnd={() => onHover(null)}
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick();
                    }}
                    className={`cursor-pointer rounded-full flex items-center justify-center relative ${
                        planet.status === 'locked' ? 'grayscale opacity-50' : ''
                    }`}
                    style={{ 
                        width: planet.size, 
                        height: planet.size,
                        background: `radial-gradient(circle at 30% 30%, ${planet.color}, #000)`,
                        boxShadow: `0 0 20px ${planet.color}40`,
                        border: `1px solid ${planet.color}60`
                    }}
                >
                    {/* Planet Glow */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-0 rounded-full blur-md"
                        style={{ backgroundColor: planet.color }}
                    />
                    
                    {/* Content inside planet based on type */}
                    <div className="relative z-10 text-white/80">
                        {planet.type === 'tech' && <Shield size={planet.size / 3} />}
                        {planet.type === 'finance' && <Target size={planet.size / 3} />}
                        {planet.type === 'prof' && <Zap size={planet.size / 3} />}
                    </div>

                    {/* Orbiting Moon for Mastered planets */}
                    {planet.status === 'mastery' && (
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0"
                        >
                            <div 
                                className="w-4 h-4 bg-slate-400 rounded-full absolute -top-6 left-1/2 -translate-x-1/2 shadow-lg"
                            />
                        </motion.div>
                    )}
                </motion.div>
                
                {/* Counter-rotation to keep icons upright */}
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: planet.orbitDuration, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 pointer-events-none"
                />
            </div>
        </motion.div>
    );
};
