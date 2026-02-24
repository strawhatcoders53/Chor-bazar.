import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Terminal, ShoppingCart, Map, AlertTriangle } from 'lucide-react';

const CommandPalette = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const { setIsCartOpen } = useCart();

    const commands = [
        { id: 'archive', name: 'Archive (Shop)', icon: Terminal, action: () => { navigate('/products'); setIsOpen(false); } },
        { id: 'cart', name: 'Open Cart', icon: ShoppingCart, action: () => { setIsCartOpen(true); setIsOpen(false); } },
        {
            id: 'map', name: 'System Map', icon: Map, action: () => {
                const targetPath = '/';
                const navigateAndScroll = () => {
                    setTimeout(() => {
                        const mapElement = document.getElementById('telemetry-section');
                        if (mapElement) {
                            mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        } else {
                            // Fallback if ID doesn't exist
                            window.scrollTo({ top: document.body.scrollHeight - 600, behavior: 'smooth' });
                        }
                    }, 150);
                };

                if (window.location.pathname !== targetPath) {
                    navigate(targetPath);
                    // Wait longer for DOM to render if we are switching routes
                    setTimeout(navigateAndScroll, 300);
                } else {
                    navigateAndScroll();
                }

                setIsOpen(false);
            }
        },
        { id: 'self-destruct', name: 'Self-Destruct', icon: AlertTriangle, action: () => triggerSelfDestruct() }
    ];

    const filteredCommands = commands.filter(cmd => cmd.name.toLowerCase().includes(search.toLowerCase()));

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') setIsOpen(false);
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setSearch('');
            setSelectedIndex(0);
        }
    }, [isOpen]);

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
            e.preventDefault();
            filteredCommands[selectedIndex].action();
        }
    };

    const triggerSelfDestruct = () => {
        setIsOpen(false);
        const root = document.getElementById('root');

        // Critical System Failure Animation sequence
        root.style.transition = 'all 0.1s ease';

        let glitchInterval = setInterval(() => {
            root.style.filter = `hue-rotate(${Math.random() * 360}deg) invert(${Math.random() > 0.5 ? 1 : 0}) contrast(300%)`;
            root.style.transform = `translate(${(Math.random() - 0.5) * 50}px, ${(Math.random() - 0.5) * 50}px) scale(${1 + Math.random() * 0.1})`;
        }, 50);

        setTimeout(() => {
            clearInterval(glitchInterval);
            root.style.filter = 'none';
            root.style.transform = 'none';
            root.style.transition = '';
            root.innerHTML = '<div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #000; color: #ff003c; font-family: monospace; font-size: 2rem;">SYSTEM TERMINATED. PLEASE REFRESH.</div>';
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    {/* Dark overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-dark-950/80 backdrop-blur-sm"
                    />

                    {/* Palette Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-xl bg-dark-900/90 backdrop-blur-xl border-2 border-neon-blue rounded-xl shadow-[0_0_40px_rgba(0,240,255,0.2)] overflow-hidden font-mono"
                    >
                        {/* Search Input */}
                        <div className="flex items-center px-4 border-b border-dark-700">
                            <Terminal className="w-5 h-5 text-neon-blue mr-3" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setSelectedIndex(0); }}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a command or search..."
                                className="w-full bg-transparent text-white placeholder-gray-500 py-4 outline-none text-lg"
                                autoComplete="off"
                                spellCheck="false"
                            />
                            <div className="text-xs text-gray-500 flex items-center gap-1 border border-dark-700 px-2 py-1 rounded bg-dark-800 absolute right-4">
                                <span>ESC</span>
                            </div>
                        </div>

                        {/* Results List */}
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {filteredCommands.length > 0 ? (
                                filteredCommands.map((cmd, index) => {
                                    const isActive = index === selectedIndex;
                                    const isDestruct = cmd.id === 'self-destruct';

                                    return (
                                        <div
                                            key={cmd.id}
                                            onClick={cmd.action}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all duration-75 relative group ${isActive ? (isDestruct ? 'bg-neon-pink/20 text-neon-pink' : 'bg-neon-blue/20 text-neon-blue') : 'text-gray-400 hover:bg-dark-800'}`}
                                        >
                                            <cmd.icon className={`w-5 h-5 mr-3 ${isActive ? (isDestruct ? 'text-neon-pink' : 'text-neon-blue') : 'text-gray-500'}`} />

                                            {/* Text with conditional Glitch effect */}
                                            <span className={`flex-1 font-medium ${isActive ? 'animate-[glitch_0.2s_infinite]' : ''}`}>
                                                {cmd.name}
                                            </span>

                                            {isActive && (
                                                <span className="text-[10px] uppercase tracking-widest opacity-70">
                                                    Execute
                                                </span>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No commands found matching "{search}"
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
