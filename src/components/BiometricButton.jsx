import React, { useState, useRef, useEffect } from 'react';
import { Fingerprint } from 'lucide-react';
import useScreenShake from '../hooks/useScreenShake';

const BiometricButton = ({ onSuccess, onStart, isProcessing, amount }) => {
    const triggerShake = useScreenShake();
    const [progress, setProgress] = useState(0);
    const [isHolding, setIsHolding] = useState(false);
    const holdTimerRef = useRef(null);
    const startTimeRef = useRef(null);
    const [shake, setShake] = useState(0);

    const DURATION = 1500; // 1.5 seconds

    const startHold = (e) => {
        // Only trigger on left-click for mouse
        if (e.type === 'mousedown' && e.button !== 0) return;

        // Prevent default text selection
        e.preventDefault();

        if (isProcessing) return;

        // Custom start validation (e.g., checking if form is valid)
        if (onStart && !onStart()) {
            return;
        }

        setIsHolding(true);
        startTimeRef.current = performance.now();

        const updateProgress = (timestamp) => {
            const elapsed = timestamp - startTimeRef.current;
            const currentProgress = Math.min((elapsed / DURATION) * 100, 100);

            setProgress(currentProgress);
            setShake((currentProgress / 100) * 8); // Scale shake up to 8px max

            if (currentProgress < 100) {
                holdTimerRef.current = requestAnimationFrame(updateProgress);
            } else {
                setIsHolding(false);
                setProgress(100);
                triggerShake(); // Physical jolt effect
                onSuccess();
            }
        };

        holdTimerRef.current = requestAnimationFrame(updateProgress);
    };

    const stopHold = () => {
        if (progress >= 100) return; // If already authorized, don't reset

        setIsHolding(false);
        setShake(0);
        if (holdTimerRef.current) {
            cancelAnimationFrame(holdTimerRef.current);
            holdTimerRef.current = null;
        }

        // Let it drain back down
        setProgress(0);
    };

    useEffect(() => {
        return () => {
            if (holdTimerRef.current) {
                cancelAnimationFrame(holdTimerRef.current);
            }
        };
    }, []);

    const shakeTransform = isHolding ? `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)` : 'none';

    return (
        <div className="w-full relative select-none touch-none" style={{ transform: shakeTransform }}>
            <button
                type="button"
                onMouseDown={startHold}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={startHold}
                onTouchEnd={stopHold}
                disabled={isProcessing}
                className={`relative w-full py-5 rounded-xl font-bold uppercase tracking-wider text-lg transition-all duration-300 overflow-hidden group outline-none ${isProcessing
                    ? 'bg-dark-600 text-gray-500 cursor-not-allowed border-dark-600 border'
                    : 'bg-dark-900 border border-dark-600 text-white hover:border-neon-pink/50'
                    }`}
            >
                {/* Background Fill Core */}
                <div
                    className="absolute inset-0 bg-neon-pink/10"
                    style={{
                        clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
                        transition: isHolding ? 'none' : 'clip-path 0.3s ease-out'
                    }}
                />

                {/* Glowing Border Fill */}
                <div
                    className="absolute inset-0 border-2 border-neon-pink rounded-xl shadow-[inset_0_0_20px_rgba(255,0,60,0.5),0_0_20px_rgba(255,0,60,0.5)] pointer-events-none"
                    style={{
                        clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
                        transition: isHolding ? 'none' : 'clip-path 0.3s ease-out',
                        opacity: isHolding ? 1 : 0
                    }}
                />

                {/* Inner Content */}
                <div className="relative z-10 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center justify-center gap-3">
                        <Fingerprint
                            className={`w-6 h-6 transition-all duration-300 ${isHolding ? 'text-neon-pink animate-pulse scale-110 drop-shadow-[0_0_8px_rgba(255,0,60,0.8)]' : 'text-gray-400 group-hover:text-neon-pink'}`}
                        />
                        <span>
                            {isProcessing
                                ? 'Processing...'
                                : progress >= 100
                                    ? 'Authorized'
                                    : isHolding
                                        ? 'Authorizing...'
                                        : `Hold to Pay $${amount.toFixed(2)}`}
                        </span>
                    </div>
                </div>
            </button>
            {!isProcessing && (
                <div className="text-center mt-3 text-xs text-gray-500 font-mono tracking-widest flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-pink animate-pulse"></span>
                    BIOMETRIC AUTHORIZATION REQUIRED
                </div>
            )}
        </div>
    );
};

export default BiometricButton;
