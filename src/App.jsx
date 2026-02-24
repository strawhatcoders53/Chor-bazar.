import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState, Suspense, lazy } from 'react';
import { useLenis } from '@studio-freight/react-lenis';
import { playClick, playWhoosh } from './utils/audioSynth';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SystemLoader from './components/SystemLoader';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import WishlistPage from './pages/WishlistPage';
import ToastNotification from './components/ToastNotification';
import LivePulse from './components/LivePulse';
import SystemHUD from './components/SystemHUD';
import CartDrawer from './components/CartDrawer';
import CursorHUD from './components/CursorHUD';
import VaultBoot from './components/VaultBoot';
import CommandPalette from './components/CommandPalette';
import { useCart } from './context/CartContext';

const ProductList = lazy(() => import('./pages/ProductList'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

import { useTheme } from './context/ThemeContext';
import useKonamiCode from './hooks/useKonamiCode';

function App() {
    const { toastMessage, showToast } = useCart();
    const { isHacked, setIsHacked } = useTheme();
    const location = useLocation();
    const lenis = useLenis();
    const [bootComplete, setBootComplete] = useState(false);
    const [triggerShake, setTriggerShake] = useState(false);

    // Listen for Konami Code
    useKonamiCode(() => {
        setIsHacked(true);
        setTriggerShake(true);
        setTimeout(() => setTriggerShake(false), 500);
        showToast("CYBER-PSYCHOSIS DETECTED: SYSTEM OVERRIDE ACTIVE.");
    });

    // Lock scroll on mount until boot finishes, and ensure resizing on route change
    useEffect(() => {
        if (lenis) {
            if (!bootComplete) {
                lenis.stop();
            } else {
                lenis.start();
                lenis.resize();
            }
        }
    }, [lenis, bootComplete, location.pathname]);

    // Play synthesized whoosh on route change, and reset smooth scroll to top
    useEffect(() => {
        playWhoosh();
        if (lenis) {
            lenis.scrollTo(0, { immediate: true });
        } else {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, lenis]);

    // Global click listener for mechanical buttons
    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.closest('.btn-primary')) {
                playClick();
            }
        };
        document.body.addEventListener('click', handleClick);
        return () => document.body.removeEventListener('click', handleClick);
    }, []);

    // Scroll progress bar logic
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className={`flex flex-col min-h-screen selection:bg-neon-blue selection:text-black relative transition-colors duration-500 
            ${isHacked ? 'hacked-bg hacked-text bg-red-950 text-red-500' : 'bg-[#050505] text-white'}
            ${triggerShake ? 'violent-shake' : ''}`}>

            <VaultBoot onComplete={() => {
                setBootComplete(true);
                if (lenis) {
                    lenis.start();
                    lenis.resize();
                }
            }} />

            {/* Scroll Progress Bar */}
            <motion.div
                className={`fixed top-0 left-0 right-0 h-1 origin-left z-[100] transition-colors duration-500 
                    ${isHacked ? 'bg-red-500 shadow-[0_0_10px_rgba(255,0,0,0.7)]' : 'bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.7)]'}`}
                style={{ scaleX }}
            />

            <Navbar />
            <main className="flex-grow pt-20"> {/* pt-20 to account for fixed navbar */}
                <Suspense fallback={<SystemLoader fullScreen={true} />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/checkout" element={<Checkout />} />
                    </Routes>
                </Suspense>
            </main>

            {/* Global Live Activity Ticker */}
            <div className={`w-full border-y py-2 overflow-hidden whitespace-nowrap backdrop-blur-sm mt-auto transition-colors duration-500 
                ${isHacked ? 'bg-red-500/10 border-red-500/20' : 'bg-neon-blue/10 border-neon-blue/20'}`}>
                <div className={`flex animate-marquee gap-10 text-xs font-mono uppercase w-max transition-colors duration-500 
                    ${isHacked ? 'text-red-500' : 'text-neon-blue'}`}>
                    {/* Double the content to ensure smooth infinite loop */}
                    <span>● SYSTEM STATUS: {isHacked ? 'COMPROMISED' : 'OPTIMAL'}</span>
                    <span>● {isHacked ? 'TERMINAL BREACH DETECTED' : 'NEW DROP: PHANTOM TECH-JACKET IN STOCK'}</span>
                    <span>● GLOBAL ORDERS: {isHacked ? 'ERROR' : '1,402 IN LAST 24H'}</span>
                    <span>● {isHacked ? 'ADMIN OVERRIDE KEY GENERATED' : 'ENCRYPTED CONNECTION ESTABLISHED'}</span>
                    <span>● SYSTEM STATUS: {isHacked ? 'COMPROMISED' : 'OPTIMAL'}</span>
                    <span>● {isHacked ? 'TERMINAL BREACH DETECTED' : 'NEW DROP: PHANTOM TECH-JACKET IN STOCK'}</span>
                    <span>● GLOBAL ORDERS: {isHacked ? 'ERROR' : '1,402 IN LAST 24H'}</span>
                    <span>● {isHacked ? 'ADMIN OVERRIDE KEY GENERATED' : 'ENCRYPTED CONNECTION ESTABLISHED'}</span>
                </div>
            </div>

            <Footer />

            {/* Global Toast Component */}
            <ToastNotification message={toastMessage} onClose={() => { }} />
            <LivePulse />
            <SystemHUD />
            <CursorHUD />
            <CartDrawer />
            <CommandPalette />
        </div>
    );
}

export default App;
