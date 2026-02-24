import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SystemLoader = ({ fullScreen = true }) => {
    const [progress, setProgress] = useState(0);
    const phrases = ['SECURE LINK ESTABLISHED...', 'PARSING ARCHIVE DATA...', 'DECRYPTING TEXTURES...'];
    const [phraseIndex, setPhraseIndex] = useState(0);

    // Simulate progress
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 98) {
                    clearInterval(interval);
                    return 99; // Holds at 99% until data actually loads and component unmounts
                }
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 150);

        return () => clearInterval(interval);
    }, []);

    // Cycle Phrases
    useEffect(() => {
        const textInterval = setInterval(() => {
            setPhraseIndex(prev => (prev + 1) % phrases.length);
        }, 2000);
        return () => clearInterval(textInterval);
    }, []);

    const containerClasses = fullScreen
        ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-dark-950 backdrop-blur-xl"
        : "w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-dark-900/50 rounded-2xl border border-dark-700 border-dashed backdrop-blur-sm";

    return (
        <div className={containerClasses}>
            {/* The Circuit Board SVG Loader */}
            <div className="relative w-32 h-32 mb-8">
                {/* Outer rotating ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-2 border-dashed border-neon-blue/30 rounded-full"
                />

                {/* Inner pulsing circuit SVG */}
                <motion.svg
                    viewBox="0 0 100 100"
                    className="absolute inset-2 w-[calc(100%-16px)] h-[calc(100%-16px)] drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"
                    animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <path d="M50 10 L50 30 M10 50 L30 50 M50 90 L50 70 M90 50 L70 50" stroke="#00f3ff" strokeWidth="4" strokeLinecap="square" />
                    <circle cx="50" cy="50" r="20" stroke="#00f3ff" strokeWidth="4" fill="transparent" />
                    <circle cx="50" cy="50" r="10" fill="#00f3ff" />
                    <path d="M25 25 L40 40 M75 25 L60 40 M25 75 L40 60 M75 75 L60 60" stroke="#00f3ff" strokeWidth="3" strokeLinecap="square" />
                    <circle cx="25" cy="25" r="4" fill="#00f3ff" />
                    <circle cx="75" cy="25" r="4" fill="#00f3ff" />
                    <circle cx="25" cy="75" r="4" fill="#00f3ff" />
                    <circle cx="75" cy="75" r="4" fill="#00f3ff" />
                </motion.svg>
            </div>

            {/* Progress Data */}
            <div className="text-center font-mono">
                <motion.div
                    className="text-white text-sm tracking-[0.3em] uppercase mb-4 h-5 flex items-center justify-center"
                    key={phraseIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                >
                    {phrases[phraseIndex]}
                </motion.div>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-neon-blue font-bold text-3xl tracking-tighter shadow-neon-blue">{progress}</span>
                    <span className="text-neon-blue text-lg">%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-dark-700 mt-6 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,1)]"
                        initial={{ width: "0%" }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    );
};

export default SystemLoader;
