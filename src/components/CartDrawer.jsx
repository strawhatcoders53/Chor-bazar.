import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { X, Trash2, ArrowRight, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const CartDrawer = () => {
    const {
        isCartOpen, setIsCartOpen, cartItems,
        cartTotal, cartSubtotal, cartCount,
        updateQuantity, removeFromCart,
        promoCode, discountAmount, applyPromoCode, removePromoCode
    } = useCart();
    const controls = useAnimation();
    const [prevCount, setPrevCount] = useState(cartCount);
    const [promoInput, setPromoInput] = useState('');

    const SHIPPING_COST = cartTotal > 150 ? 0 : 15;
    const TAX_RATE = 0.08;
    const taxes = cartTotal * TAX_RATE;
    const finalTotal = cartTotal + SHIPPING_COST + taxes;

    // Screen Shake Effect on Item Add
    useEffect(() => {
        if (cartCount > prevCount) {
            controls.start({
                x: [0, -10, 10, -10, 10, -5, 5, 0],
                transition: { duration: 0.4, ease: "easeInOut" }
            });
            // If the cart isn't open, maybe open it? Not strictly requested, but good UX. 
            // We'll leave it as just shaking if open.
        }
        setPrevCount(cartCount);
    }, [cartCount, prevCount, controls]);

    // Calculate energy level distortion (maxes out around 10 items)
    const energyLevel = Math.min(cartCount / 10, 1);
    const glitchIntensity = energyLevel * 100;

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[450px] z-[101] flex flex-col"
                    >
                        {/* Shaking Container & Glitch Background */}
                        <motion.div
                            animate={controls}
                            className="flex-grow flex flex-col relative h-full bg-dark-900/40 backdrop-blur-[30px] border-l border-neon-blue/30 shadow-[-10px_0_30px_rgba(0,240,255,0.1)] overflow-hidden mix-blend-overlay"
                        >
                            {/* Energy Level Distortion Layer */}
                            <div
                                className="absolute inset-0 pointer-events-none opacity-20"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.5 + (energyLevel * 2)}' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                                    filter: `contrast(${100 + glitchIntensity}%) brightness(${100 + (energyLevel * 50)}%)`,
                                    mixBlendMode: 'overlay'
                                }}
                            />

                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10 relative z-10">
                                <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                                    System Cargo
                                    <span className="text-neon-blue text-sm border border-neon-blue px-2 py-0.5 rounded-full shadow-[0_0_10px_#00f3ff]">
                                        PWR: {Math.round(energyLevel * 100)}%
                                    </span>
                                </h1>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-gray-400 hover:text-white transition-colors bg-dark-800 p-2 rounded-full border border-white/10 hover:border-neon-pink hover:shadow-[0_0_15px_#ff00ff]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Cart Items */}
                            <div className="flex-grow overflow-y-auto p-6 space-y-6 relative z-10 custom-scrollbar">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                                        <div className="w-16 h-16 border border-dashed border-gray-600 rounded-full flex items-center justify-center">
                                            <span className="text-2xl font-mono">0</span>
                                        </div>
                                        <p className="uppercase tracking-widest text-sm">Cargo Empty</p>
                                    </div>
                                ) : (
                                    cartItems.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, x: 50 }}
                                            className="flex gap-4 p-4 bg-dark-800/50 rounded-xl border border-white/5 hover:border-white/20 transition-colors backdrop-blur-md"
                                        >
                                            <div className="w-20 h-20 bg-dark-700 rounded-lg overflow-hidden shrink-0 border border-dark-600">
                                                <img src={item.image} alt={item.title} className="w-full h-full object-cover mix-blend-screen opacity-80" />
                                            </div>
                                            <div className="flex-grow flex flex-col justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="text-neon-pink text-[10px] font-bold uppercase tracking-widest mb-1">{item.category}</div>
                                                        <Link to={`/product/${item.id}`} onClick={() => setIsCartOpen(false)} className="text-white hover:text-neon-blue font-semibold text-sm line-clamp-2 leading-tight transition-colors">
                                                            {item.title}
                                                        </Link>
                                                    </div>
                                                    <button onClick={() => removeFromCart(item.id)} className="text-gray-500 hover:text-neon-pink transition-colors p-1">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <div className="text-white font-medium">${item.price.toFixed(2)}</div>
                                                    <div className="flex items-center gap-2 bg-dark-900 border border-dark-600 rounded-lg px-2 py-1">
                                                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-white transition-colors text-xs px-1">-</button>
                                                        <span className="text-white text-xs font-bold w-4 text-center">{item.quantity}</span>
                                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-white transition-colors text-xs px-1">+</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Footer / Summary */}
                            {cartItems.length > 0 && (
                                <div className="p-6 border-t border-white/10 bg-dark-900/80 backdrop-blur-xl relative z-10 flex flex-col gap-4">

                                    {/* Promo Code Input */}
                                    {!promoCode ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value)}
                                                placeholder="AUTHORIZATION CODE"
                                                className="bg-dark-800 border-dark-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm uppercase tracking-wider focus:outline-none focus:border-neon-blue flex-grow border font-mono"
                                            />
                                            <button
                                                onClick={() => {
                                                    const res = applyPromoCode(promoInput);
                                                    if (res.success) setPromoInput('');
                                                }}
                                                className="bg-dark-700 hover:bg-neon-blue hover:text-dark-900 text-white px-4 rounded-lg text-xs font-bold uppercase transition-colors whitespace-nowrap"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-between items-center bg-neon-green/10 border border-neon-green/30 p-3 rounded-lg">
                                            <div className="flex flex-col">
                                                <span className="text-neon-green text-xs font-bold tracking-widest uppercase">Active Override</span>
                                                <span className="text-white font-mono text-sm">{promoCode}</span>
                                            </div>
                                            <button onClick={removePromoCode} className="text-gray-400 hover:text-neon-pink text-xs underline decoration-dark-600 underline-offset-4 tracking-wider uppercase">Remove</button>
                                        </div>
                                    )}

                                    <div className="space-y-3 mb-2 text-sm">
                                        <div className="flex justify-between text-gray-400">
                                            <span>Subtotal</span>
                                            <span className="text-white">${cartSubtotal.toFixed(2)}</span>
                                        </div>
                                        {promoCode && (
                                            <div className="flex justify-between text-neon-green">
                                                <span>Discount ({promoCode})</span>
                                                <span>-${discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-gray-400">
                                            <span>Routing Fee</span>
                                            <span className="text-white">
                                                {SHIPPING_COST === 0 ? <span className="text-neon-green">FREE</span> : `$${SHIPPING_COST.toFixed(2)}`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-white/10">
                                            <span>Final Authorization</span>
                                            <span className="text-neon-blue">${finalTotal.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Link to="/checkout" onClick={() => setIsCartOpen(false)} className="btn-primary w-full flex justify-center py-3 mb-3 text-sm">
                                        INITIALIZE SECURE CHECKOUT
                                    </Link>

                                    <div className="text-center flex justify-center items-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
                                        <Shield size={12} className="text-neon-green" /> Military Grade Encryption Active
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
