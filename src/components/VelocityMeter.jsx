import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { Zap, Unlock } from 'lucide-react';
import { createPortal } from 'react-dom';
import { playWhoosh, playClick } from '../utils/audioSynth';

const VelocityMeter = () => {
    const { cartCount } = useCart();
    const [hasBoomed, setHasBoomed] = useState(false);
    const [showPromo, setShowPromo] = useState(false);
    const targetItems = 3;

    // Calculate percentage, maxing out at 100%
    const progress = Math.min((cartCount / targetItems) * 100, 100);

    useEffect(() => {
        // Trigger Sonic Boom when hitting the target EXACTLY for the first time
        if (cartCount >= targetItems && !hasBoomed) {
            setHasBoomed(true);
            playWhoosh();

            // Trigger Sonic Boom flash & shake
            document.body.classList.add('sonic-boom-active');

            // Show Promo Overlay after boom clears
            setTimeout(() => {
                setShowPromo(true);
                playClick(); // secondary synth sound for the HUD ping
                document.body.classList.remove('sonic-boom-active');
            }, 800);
        }
    }, [cartCount, hasBoomed]);

    // Copy to clipboard handler
    const copyPromoCode = () => {
        navigator.clipboard.writeText('MACH_SPEED_20');
        playClick();
        setShowPromo(false); // Dismiss after copy
    };

    return (
        <>
            <div className="flex flex-col gap-1 w-32 md:w-48 ml-4 mr-2">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-neon-blue font-bold tracking-widest uppercase flex items-center gap-1">
                        <Zap size={10} className={`${progress === 100 ? 'text-neon-pink' : 'text-neon-blue'}`} />
                        Velocity
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                        {cartCount}/{targetItems} MAX
                    </span>
                </div>

                {/* Meter Background */}
                <div className="h-1.5 w-full bg-dark-800 rounded-full overflow-hidden border border-dark-600 relative">
                    {/* Meter Fill */}
                    <motion.div
                        className={`absolute top-0 left-0 h-full rounded-full ${progress === 100 ? 'bg-neon-pink shadow-[0_0_10px_rgba(255,0,60,0.8)]' : 'bg-neon-blue shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                            }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    />

                    {/* Tick Marks for each item Required */}
                    <div className="absolute inset-0 flex justify-between px-[33%] border-x border-dark-900/50 pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-0 flex justify-between px-[66%] border-x border-dark-900/50 pointer-events-none mix-blend-overlay"></div>
                </div>
            </div>

            {/* SONIC BOOM OVERLAY & PROMO CODE REVEAL */}
            {createPortal(
                <AnimatePresence>
                    {showPromo && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="fixed inset-0 z-[10000] flex items-center justify-center bg-dark-900/90 backdrop-blur-md"
                        >
                            <motion.div
                                initial={{ y: 50, scale: 0.9, opacity: 0 }}
                                animate={{ y: 0, scale: 1, opacity: 1 }}
                                transition={{ type: "spring", bounce: 0.5 }}
                                className="bg-dark-800 border-2 border-neon-pink p-8 rounded-2xl shadow-[0_0_50px_rgba(255,0,60,0.3)] relative max-w-lg w-full text-center overflow-hidden"
                            >
                                {/* Glitch background accents */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-neon-pink/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-32 h-32 bg-neon-blue/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-neon-pink/20 flex items-center justify-center border border-neon-pink shadow-[0_0_15px_rgba(255,0,60,0.5)]">
                                        <Unlock className="w-8 h-8 text-neon-pink animate-pulse" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-widest glitch-text" data-text="MAX VELOCITY ACHIEVED">
                                    MAX VELOCITY ACHIEVED
                                </h2>

                                <p className="text-gray-400 mb-8 font-mono text-sm">
                                    System overloaded. Unauthorized transmission intercepted.
                                    Applying terminal override code:
                                </p>

                                <div className="bg-black border border-dark-600 p-4 rounded-xl mb-8 relative group cursor-pointer" onClick={copyPromoCode}>
                                    <div className="absolute inset-0 bg-neon-pink/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl"></div>
                                    <h3 className="text-4xl font-mono text-neon-pink font-bold tracking-tighter shadow-neon-pink drop-shadow-[0_0_8px_rgba(255,0,60,0.6)]">
                                        MACH_SPEED_20
                                    </h3>
                                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest group-hover:text-neon-pink transition-colors">
                                        Click to Copy & Deploy
                                    </p>
                                </div>

                                <button
                                    onClick={() => setShowPromo(false)}
                                    className="text-gray-500 hover:text-white text-xs uppercase tracking-widest underline decoration-dark-600 underline-offset-4 transition-colors"
                                >
                                    Close Transmission
                                </button>

                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default VelocityMeter;
