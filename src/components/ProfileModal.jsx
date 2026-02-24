import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Fingerprint, Lock, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProfileModal = ({ isOpen, onClose }) => {
    const [scanState, setScanState] = useState('idle'); // idle, scanning, verified

    useEffect(() => {
        if (!isOpen) {
            setScanState('idle');
        }
    }, [isOpen]);

    const handleMockLogin = () => {
        setScanState('scanning');
        setTimeout(() => {
            setScanState('verified');
        }, 2000);
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-dark-900/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, y: 10, opacity: 0 }}
                        className="bg-dark-800 border border-dark-600 rounded-3xl p-8 max-w-sm w-full relative overflow-hidden flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background mesh glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-neon-purple/20 blur-[50px] pointer-events-none rounded-full" />

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <Shield className="w-12 h-12 text-neon-blue mb-6 relative z-10" />

                        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-2 relative z-10">
                            System Access
                        </h2>

                        <p className="text-gray-400 text-sm mb-8 relative z-10">
                            Identify yourself to access secured archives and personalized gear loadouts.
                        </p>

                        {scanState === 'idle' && (
                            <button
                                onClick={handleMockLogin}
                                className="group w-full relative flex items-center justify-center gap-3 bg-dark-900 border border-dark-600 hover:border-neon-Pink rounded-xl py-4 transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-neon-pink/0 via-neon-pink/10 to-neon-pink/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <Fingerprint className="w-6 h-6 text-neon-pink group-hover:scale-110 transition-transform" />
                                <span className="text-white font-bold tracking-widest uppercase text-sm">Initiate Biometric Link</span>
                            </button>
                        )}

                        {scanState === 'scanning' && (
                            <div className="w-full flex flex-col items-center py-4">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-12 h-12 border-2 border-dark-600 border-t-neon-blue rounded-full mb-4"
                                />
                                <span className="text-neon-blue font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Running Scan...</span>
                            </div>
                        )}

                        {scanState === 'verified' && (
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full flex flex-col items-center py-4"
                            >
                                <div className="w-16 h-16 bg-neon-green/20 border border-neon-green rounded-full flex items-center justify-center mb-4">
                                    <Zap className="w-8 h-8 text-neon-green" />
                                </div>
                                <span className="text-neon-green font-bold uppercase tracking-wider mb-2">Access Granted</span>
                                <span className="text-gray-400 text-xs">Module under construction. User link established.</span>

                                <button
                                    onClick={onClose}
                                    className="mt-6 text-sm text-gray-400 hover:text-white underline underline-offset-4"
                                >
                                    Return to Session
                                </button>
                            </motion.div>
                        )}

                        <div className="w-full border-t border-dark-700 mt-8 pt-6 relative z-10">
                            <span className="text-gray-600 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">
                                <Lock className="w-3 h-3" /> Encrypted Protocol V.9
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ProfileModal;
