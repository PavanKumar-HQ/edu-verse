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

        const STAR_COUNT = 150;
        const METEOR_FREQUENCY = 0.02;

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
                    radius: Math.random() * 1.2,
                    alpha: Math.random(),
                    twinkleSpeed: (Math.random() - 0.5) * 0.015
                });
            }
        };

        const createMeteor = () => {
            meteors.push({
                x: Math.random() * width + 200,
                y: Math.random() * height * 0.5 - 100,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 15 + 10,
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
            let tint = 'rgba(2, 6, 23, 1)';
            if (state === 'cyber') tint = 'rgba(2, 20, 20, 1)';
            if (state === 'ai') tint = 'rgba(10, 10, 30, 1)';
            if (state === 'finance') tint = 'rgba(15, 10, 25, 1)';
            
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
                m.alpha -= 0.01;

                if (m.alpha <= 0) {
                    meteors.splice(i, 1);
                    continue;
                }

                const grad = ctx.createLinearGradient(m.x, m.y, m.x + m.length, m.y - m.length);
                grad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
                grad.addColorStop(1, 'rgba(59, 130, 246, 0)');

                ctx.strokeStyle = grad;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(m.x, m.y);
                ctx.lineTo(m.x + m.length, m.y - m.length);
                ctx.stroke();
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
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
            
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
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
