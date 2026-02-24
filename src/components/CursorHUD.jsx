import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorHUD = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    // Smooth, snappy trailing for the HUD
    const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    const [isScanning, setIsScanning] = useState(false);
    const [scanData, setScanData] = useState({ price: '', stock: '' });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Only show custom cursor on devices with a fine pointer (mouse/trackpad)
        if (window.matchMedia("(pointer: coarse)").matches) return;

        const moveCursor = (e) => {
            if (!isVisible) setIsVisible(true);
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e) => {
            const scanTarget = e.target.closest('[data-scan="true"]');
            if (scanTarget) {
                setIsScanning(true);
                setScanData({
                    price: scanTarget.getAttribute('data-price') || 'N/A',
                    stock: scanTarget.getAttribute('data-stock') || 'N/A'
                });
            } else {
                setIsScanning(false);
            }
        };

        const handleMouseLeave = () => setIsVisible(false);

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [cursorX, cursorY, isVisible]);

    if (!isVisible) return null;

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center mix-blend-screen"
            style={{
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            {/* Center Dot - System Probe */}
            <div className="w-1 h-1 bg-white rounded-full shadow-[0_0_8px_#fff] relative z-20" />

            {/* Rotating Ring */}
            <motion.div
                animate={{
                    rotate: 360,
                    scale: isScanning ? 1.5 : 1,
                    borderColor: isScanning ? '#ff003c' : '#00f3ff',
                    borderWidth: isScanning ? '2px' : '1px',
                }}
                transition={{
                    rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                    scale: { type: "spring", stiffness: 400, damping: 25 },
                    borderColor: { duration: 0.2 }
                }}
                className={`absolute rounded-full border-dashed ${isScanning ? 'w-[60px] h-[60px] shadow-[0_0_20px_rgba(255,0,60,0.6)]' : 'w-8 h-8 opacity-60'}`}
            />

            {/* Outer Reticle Corners - visible only when scanning */}
            {isScanning && (
                <motion.div
                    initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="absolute w-[80px] h-[80px] border border-[#ff003c]/30 rounded-full border-t-transparent border-b-transparent"
                />
            )}

            {/* Orbiting Text (Non-rotating container so text stays readable) */}
            {isScanning && (
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: -45 }}
                    className="absolute text-[9px] font-mono text-[#ff003c] font-bold tracking-widest whitespace-nowrap bg-dark-900/90 px-2 py-0.5 rounded border border-[#ff003c]/50 shadow-[0_0_10px_rgba(255,0,60,0.4)] backdrop-blur-md z-30"
                >
                    ${parseFloat(scanData.price).toFixed(2)} | QTY:{scanData.stock}
                </motion.div>
            )}
        </motion.div>
    );
};

export default CursorHUD;
