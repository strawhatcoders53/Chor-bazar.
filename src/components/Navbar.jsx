import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Heart, Cpu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import ProfileModal from './ProfileModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from '@studio-freight/react-lenis';
import VelocityMeter from './VelocityMeter';
import AITerminal from './AITerminal';

const Navbar = () => {
    const { cartCount, setIsCartOpen } = useCart();
    const { wishlist } = useWishlist();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isAITerminalOpen, setIsAITerminalOpen] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const location = useLocation();
    const lenis = useLenis();

    const navLinks = [
        { name: 'HOME', path: '/' },
        { name: 'SHOP', path: '/products' },
        { name: 'JACKETS', path: '/products?category=Jackets' },
        { name: 'ACCESSORIES', path: '/products?category=Accessories' },
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-900/90 backdrop-blur-lg border-b border-dark-700/50 shadow-lg' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="text-2xl font-display font-bold text-white tracking-wider">
                            CHOR<span className="text-neon-pink">BAZZAR</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-2 relative" onMouseLeave={() => setHoveredIndex(null)}>
                        {navLinks.map((link, index) => (
                            <div key={link.name} className="relative z-10" onMouseEnter={() => setHoveredIndex(index)}>
                                <Link
                                    to={link.path}
                                    className="relative z-20 px-4 py-2 text-gray-300 hover:text-white transition-colors duration-200 font-medium block"
                                >
                                    {link.name}
                                </Link>
                                {hoveredIndex === index && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 z-10 bg-neon-blue/20 backdrop-blur-md border border-neon-blue/50 rounded-full shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 350,
                                            damping: 30,
                                            mass: 0.8
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <VelocityMeter />
                        <button onClick={() => setIsAITerminalOpen(true)} className="relative group text-neon-blue hover:text-white transition-colors">
                            <Cpu className="w-5 h-5 group-hover:animate-pulse drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase font-mono tracking-wider opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">AI Link</span>
                        </button>
                        <button onClick={() => setIsSearchOpen(true)} className="text-gray-300 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <button onClick={() => setIsProfileOpen(true)} className="text-gray-300 hover:text-white transition-colors">
                            <User className="w-5 h-5" />
                        </button>
                        <Link to="/wishlist" className="relative text-gray-300 hover:text-neon-pink transition-colors">
                            <Heart className="w-5 h-5" />
                            <AnimatePresence>
                                {wishlist.length > 0 && (
                                    <motion.span
                                        key={wishlist.length}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [1.5, 1] }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                                        className="absolute -top-2 -right-2 bg-neon-pink text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_10px_#ff00ff]"
                                    >
                                        {wishlist.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-300 hover:text-neon-pink transition-colors">
                            <ShoppingCart className="w-5 h-5" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        key={cartCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [1.5, 1] }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                                        className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_10px_#ff00ff]"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>

                    <div className="flex md:hidden items-center space-x-4">
                        <Link to="/wishlist" className="relative text-gray-300 hover:text-white transition-colors">
                            <Heart className="w-6 h-6" />
                            <AnimatePresence>
                                {wishlist.length > 0 && (
                                    <motion.span
                                        key={wishlist.length}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [1.5, 1] }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                                        className="absolute -top-1 -right-2 bg-neon-pink text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_10px_#ff00ff]"
                                    >
                                        {wishlist.length}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                        <button onClick={() => setIsCartOpen(true)} className="relative text-gray-300 hover:text-white transition-colors">
                            <ShoppingCart className="w-6 h-6" />
                            <AnimatePresence>
                                {cartCount > 0 && (
                                    <motion.span
                                        key={cartCount}
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [1.5, 1] }}
                                        transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                                        className="absolute -top-2 -right-2 bg-neon-pink text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-[0_0_10px_#ff00ff]"
                                    >
                                        {cartCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white">
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-dark-800/95 backdrop-blur-lg border-b border-dark-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-dark-900 border-b border-dark-700">
                        <div className="mb-4">
                            <VelocityMeter />
                        </div>
                        {navLinks.map((link) => (
                            <Link key={link.name} to={link.path} className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-700 transition-colors">
                                {link.name}
                            </Link>
                        ))}

                        <div className="h-px bg-dark-700 my-4" />

                        <div className="flex space-x-6 pt-2">
                            <button onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }} className="text-gray-300 hover:text-white flex items-center gap-2">
                                <Search className="w-5 h-5" /> Search
                            </button>
                            <button onClick={() => { setIsMobileMenuOpen(false); setIsProfileOpen(true); }} className="text-gray-300 hover:text-white flex items-center gap-2">
                                <User className="w-5 h-5" /> Account
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modals & Terminal */}
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            <AITerminal isOpen={isAITerminalOpen} onClose={() => setIsAITerminalOpen(false)} />
        </nav>
    );
};

export default Navbar;
