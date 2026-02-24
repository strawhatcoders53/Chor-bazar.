import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BootSequence = () => {
    const [progress, setProgress] = useState(0);
    const [lines, setLines] = useState([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isUnmounted, setIsUnmounted] = useState(false);

    const sequence = [
        "INITIALIZING STITCH PROTOCOL...",
        "LOADING ANTI-GRAVITY ENGINE...",
        "DECRYPTING CHOR BAZZAR ARCHIVE...",
        "ACCESS GRANTED. WELCOME TO THE NETWORK."
    ];

    useEffect(() => {
        // Ensure browser scrolls to top immediately on mount 
        // behind the boot sequence so the sliding doors reveal neatly.
        window.scrollTo(0, 0);

        const startTime = Date.now();
        const duration = 1800; // ms

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const percentage = Math.min((elapsed / duration) * 100, 100);

            // Adding a little random jitter to the progress bar look
            const jitter = Math.random() * 5;
            setProgress(Math.min(percentage + (percentage < 100 ? jitter : 0), 100));

            if (elapsed >= duration) {
                clearInterval(progressInterval);
                setProgress(100);
                setTimeout(() => setIsComplete(true), 200); // 200ms pause at 100%
                setTimeout(() => setIsUnmounted(true), 1200); // 1s door animation
            }
        }, 50);

        // Timer for text lines
        const timeouts = [];
        sequence.forEach((line, index) => {
            const delay = index * 450;
            const t = setTimeout(() => {
                setLines(prev => [...prev, line]);
            }, delay);
            timeouts.push(t);
        });

        // Hide main app scrollbar temporarily during boot to prevent scrolling
        document.body.style.overflow = 'hidden';
        const cleanupScroll = setTimeout(() => {
            document.body.style.overflow = '';
        }, 2200);

        return () => {
            clearInterval(progressInterval);
            timeouts.forEach(clearTimeout);
            clearTimeout(cleanupScroll);
            document.body.style.overflow = '';
        };
    }, []);

    if (isUnmounted) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex overflow-hidden font-mono selection:bg-neon-green selection:text-black">

            {/* Left Door */}
            <motion.div
                className="w-1/2 h-full bg-black border-r border-[#00ff66]/30 relative flex flex-col justify-end p-8 sm:p-16 text-[#00ff66]"
                initial={{ x: 0 }}
                animate={{ x: isComplete ? '-100%' : 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                {/* Visual grid behind text */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />

                <div className="relative z-10 w-[200%] sm:w-[150%] xl:w-[120%] pointer-events-none mb-[10vh]">
                    {/* Text container spans across the center divide since Left Door is w-1/2 */}
                    <div className="space-y-2 text-xs sm:text-base md:text-xl lg:text-2xl font-bold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(0,255,102,0.8)]">
                        {lines.map((line, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-[#00ff66]/70">&gt;</span>
                                <span>{line}</span>
                            </div>
                        ))}

                        {/* Blinking Cursor */}
                        {!isComplete && (
                            <div className="flex gap-4 mt-2">
                                <span className="text-[#00ff66]/70">&gt;</span>
                                <span className="animate-[pulse_0.75s_step-end_infinite]">_</span>
                            </div>
                        )}
                    </div>

                    {/* Progress Bar Display */}
                    <div className="mt-12 w-full max-w-sm">
                        <div className="flex justify-between items-center mb-2 font-bold text-xs sm:text-sm text-[#00ff66]/70 tracking-widest">
                            <span>SYSTEM BOOT PROCESS</span>
                            <span>{Math.floor(progress)}%</span>
                        </div>
                        <div className="h-1 lg:h-2 w-full bg-dark-900 border border-[#00ff66]/30">
                            <div
                                className="h-full bg-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.8)] transition-all duration-75 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Right Door */}
            <motion.div
                className="w-1/2 h-full bg-black border-l border-[#00ff66]/30 relative"
                initial={{ x: 0 }}
                animate={{ x: isComplete ? '100%' : 0 }}
                transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,102,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,102,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
            </motion.div>

        </div>
    );
};

export default BootSequence;
