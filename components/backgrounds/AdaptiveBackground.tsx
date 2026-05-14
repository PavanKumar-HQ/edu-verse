import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type LearningState = 'focus' | 'cyber' | 'ai' | 'finance' | 'revision' | 'mastery';

interface AdaptiveBackgroundProps {
    state: LearningState;
}

export const AdaptiveBackground: React.FC<AdaptiveBackgroundProps> = ({ state }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        let animationFrameId: number;

        const STAR_COUNT = 200;
        const METEOR_FREQUENCY = 0.08; // Significantly increased for wow factor

        interface Star {
            x: number;
            y: number;
            radius: number;
            alpha: number;
            twinkleSpeed: number;
        }

        interface Meteor {
            x: number;
            y: number;
            length: number;
            speed: number;
            angle: number;
            alpha: number;
        }

        let stars: Star[] = [];
        let meteors: Meteor[] = [];

        const initStars = () => {
            stars = [];
            for (let i = 0; i < STAR_COUNT; i++) {
                stars.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5,
                    alpha: Math.random(),
                    twinkleSpeed: (Math.random() - 0.5) * 0.02
                });
            }
        };

        const createMeteor = () => {
            meteors.push({
                x: Math.random() * width + 400,
                y: Math.random() * height * 0.4 - 100,
                length: Math.random() * 120 + 60,
                speed: Math.random() * 15 + 12,
                angle: Math.PI * 0.75,
                alpha: 1
            });
        };

        const setSize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };

        setSize();
        window.addEventListener('resize', setSize);

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Background Tint based on state
            let tint = '#020617'; // slate-950
            if (state === 'cyber') tint = '#020f0f';
            if (state === 'ai') tint = '#0a0a1e';
            if (state === 'finance') tint = '#0f0a19';
            
            ctx.fillStyle = tint;
            ctx.fillRect(0, 0, width, height);

            // Draw Stars
            stars.forEach(star => {
                star.alpha += star.twinkleSpeed;
                if (star.alpha > 1 || star.alpha < 0.2) star.twinkleSpeed = -star.twinkleSpeed;
                
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
                ctx.fill();
            });

            // Meteors
            if (Math.random() < METEOR_FREQUENCY) createMeteor();

            for (let i = meteors.length - 1; i >= 0; i--) {
                const m = meteors[i];
                m.x -= m.speed;
                m.y += m.speed;
                m.alpha -= 0.012;

                if (m.alpha <= 0) {
                    meteors.splice(i, 1);
                    continue;
                }

                // Meteor Tail
                const grad = ctx.createLinearGradient(m.x, m.y, m.x + m.length, m.y - m.length);
                let tailColor = '59, 130, 246'; // blue
                if (state === 'cyber') tailColor = '16, 185, 129'; // emerald
                if (state === 'finance') tailColor = '139, 92, 246'; // purple

                grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
                grad.addColorStop(0.1, `rgba(${tailColor}, ${m.alpha * 0.8})`);
                grad.addColorStop(1, `rgba(${tailColor}, 0)`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x + m.length, m.y - m.length);
                ctx.stroke();

                // Meteor Head Glow
                ctx.beginPath();
                ctx.arc(m.x, m.y, 2, 0, Math.PI * 2);
                ctx.fillStyle = '#fff';
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgb(${tailColor})`;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => {
            window.removeEventListener('resize', setSize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [state]);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <canvas ref={canvasRef} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
            
            {/* Dynamic Glow Overlay based on state */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={state}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    {state === 'cyber' && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.1),transparent)]" />
                    )}
                    {state === 'ai' && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.1),transparent)]" />
                    )}
                    {state === 'finance' && (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.1),transparent)]" />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

