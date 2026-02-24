import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VaultBoot = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        document.body.style.overflow = 'hidden';

        const duration = 2500; // Total boot duration
        const startTime = Date.now();

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const currentProgress = Math.min((elapsed / duration) * 100, 100);

            setProgress(currentProgress);

            if (currentProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => setIsUnlocked(true), 300); // Small pause at 100% before unlock
                setTimeout(() => {
                    setIsUnmounted(true);
                    document.body.style.overflow = '';
                    if (onComplete) onComplete();
                }, 1500); // Wait for unlock animation to finish
            }
        }, 30);

        return () => {
            clearInterval(interval);
            document.body.style.overflow = '';
        };
    }, []);

    if (isUnmounted) return null;

    // Generate random particles for the shatter effect
    const particles = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        angle: (Math.PI * 2 * i) / 40 + (Math.random() * 0.2 - 0.1), // Distribute in circle with slight randomness
        distance: Math.random() * 40 + 60, // Distance to travel (percentage of screen)
        size: Math.random() * 4 + 1, // Particle size
        duration: Math.random() * 0.5 + 0.5, // Travel time
    }));

    return (
        <AnimatePresence>
            {!isUnlocked && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center pointer-events-none"
                    initial={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }} // The "Scale Out" and blur reveal
                    transition={{ duration: 0.8, ease: "easeIn" }}
                >
                    {/* The Vault Lock (Thin Circular Neon Ring) */}
                    <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
                        {/* Static Outer Ring */}
                        <div className="absolute inset-0 rounded-full border border-neon-blue/20" />

                        {/* Rotating Dash Ring */}
                        <motion.div
                            className="absolute inset-[-4px] rounded-full border border-dashed border-neon-blue/40"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, ease: "linear", repeat: Infinity }}
                        />

                        {/* Slowly Rotating Main Ring with Glow */}
                        <motion.div
                            className="absolute inset-0 rounded-full border-[1px] border-neon-blue shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                            style={{
                                maskImage: 'conic-gradient(transparent 20%, black)',
                                WebkitMaskImage: 'conic-gradient(transparent 20%, black)'
                            }}
                            animate={{ rotate: -360 }}
                            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                        />

                        {/* Central Soft Pulse Glow */}
                        <motion.div
                            className="absolute w-1/2 h-1/2 rounded-full bg-neon-blue/10 blur-[40px]"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
                        />

                        {/* Glitch Logo Fragments */}
                        {progress > 10 && progress < 90 && Math.random() > 0.85 && (
                            <div className="absolute inset-0 flex items-center justify-center text-neon-blue/30 font-display font-black text-4xl uppercase tracking-[0.5em] mix-blend-screen opacity-50 z-0">
                                <span className={`absolute translate-x-[${Math.random() * 10 - 5}px] translate-y-[${Math.random() * 10 - 5}px]`}>
                                    CHOR
                                </span>
                            </div>
                        )}
                        {progress > 50 && progress < 90 && Math.random() > 0.9 && (
                            <div className="absolute inset-0 flex items-center justify-center text-neon-pink/20 font-display font-black text-4xl uppercase tracking-[0.5em] mix-blend-screen opacity-50 z-0 scale-110 blur-[2px]">
                                <span className={`absolute translate-x-[${Math.random() * 20 - 10}px] translate-y-[${Math.random() * 20 - 10}px]`}>
                                    BAZAAR
                                </span>
                            </div>
                        )}


                        {/* Percentage Counter inside the ring */}
                        <div className="relative z-10 font-mono text-neon-blue text-4xl md:text-5xl font-light tracking-[0.2em] ml-2">
                            {Math.floor(progress)}<span className="text-xl opacity-50 ml-1">%</span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Shatter Particles Layer - Rendered during the unlock phase */}
            {isUnlocked && (
                <div className="fixed inset-0 z-[10000] pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0">
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                className="absolute bg-neon-blue rounded-full shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                                style={{
                                    width: p.size,
                                    height: p.size,
                                }}
                                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                                animate={{
                                    x: Math.cos(p.angle) * window.innerWidth * (p.distance / 100),
                                    y: Math.sin(p.angle) * window.innerHeight * (p.distance / 100),
                                    opacity: 0,
                                    scale: 0.1,
                                }}
                                transition={{
                                    duration: p.duration,
                                    ease: "easeOut",
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default VaultBoot;
