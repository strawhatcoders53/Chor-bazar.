import { ShoppingCart, Star, Heart, Scan } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Modal from './Modal';

const TypewriterText = ({ text, delayOffset, rightAlign }) => (
    <motion.div
        variants={{
            rest: { clipPath: rightAlign ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", opacity: 0 },
            hover: { clipPath: "inset(0 0% 0 0%)", opacity: 1 }
        }}
        transition={{ duration: 0.4, delay: delayOffset, ease: "linear" }}
        className={`font-mono text-[10px] sm:text-xs text-neon-blue bg-dark-900/80 px-2 py-0.5 ${rightAlign ? 'border-r-2' : 'border-l-2'} border-neon-blue uppercase tracking-widest shadow-[0_0_10px_rgba(0,240,255,0.2)] whitespace-nowrap`}
    >
        {text}
    </motion.div>
);

const ProductCard = ({ product, isLarge = false, isHorizontal = false }) => {
    const { addToCart, showToast } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    const isStashed = isInWishlist(product.id);

    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });

    const skew = useTransform(smoothVelocity, [-3000, 3000], [15, -15]);
    const brightness = useTransform(smoothVelocity, [-3000, 0, 3000], [1.8, 1, 1.8]);
    const filter = useTransform(brightness, b => `brightness(${b})`);

    const imgRef = useRef(null);
    const [isFlying, setIsFlying] = useState(false);
    const [startCoords, setStartCoords] = useState({ top: 0, left: 0, width: 0 });
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (imgRef.current && !isFlying) {
            const rect = imgRef.current.getBoundingClientRect();
            setStartCoords({
                top: rect.top,
                left: rect.left,
                width: rect.width
            });
            setIsFlying(true);

            // Trigger the actual cart update slightly before animation ends for best sync
            setTimeout(() => {
                addToCart(product);
            }, 600);

            // Clean up the flying element
            setTimeout(() => {
                setIsFlying(false);
            }, 1000);
        } else {
            addToCart(product);
        }
    };

    return (
        <>
            <Link
                to={`/product/${product.id}`}
                className="group block h-full"
                data-scan="true"
                data-price={product.price}
                data-stock={product.stock}
            >
                <div className={`diamond-cut overflow-hidden transition-all duration-300 bg-dark-800/50 h-full flex ${isHorizontal ? 'flex-row' : 'flex-col'} ${!isLarge && !isHorizontal ? 'hover:-translate-y-1' : ''}`}>
                    <div className="diamond-border w-full h-full">
                        <div className={`diamond-inner h-full relative flex ${isHorizontal ? 'flex-row' : 'flex-col'}`}>
                            {/* Image Container with X-Ray Hover */}
                            <motion.div
                                initial="rest"
                                whileHover="hover"
                                animate="rest"
                                className={`relative overflow-hidden bg-dark-700 group/image shrink-0 ${isHorizontal ? 'w-1/2 min-h-full' : (isLarge ? 'h-[65%] w-full' : 'h-[55%] w-full')}`}
                            >
                                {/* Base Image */}
                                <motion.img
                                    ref={imgRef}
                                    src={product.image}
                                    alt={product.title}
                                    style={{ skewY: skew, filter }}
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100 will-change-transform"
                                    loading="lazy"
                                />

                                {/* X-Ray / Blueprint Overlay Revealed by Clip Path */}
                                <motion.div
                                    variants={{
                                        rest: { clipPath: "inset(0% 0% 100% 0%)", opacity: 0 },
                                        hover: {
                                            clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"],
                                            opacity: 1
                                        }
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 z-10 pointer-events-none mix-blend-screen"
                                >
                                    <motion.img
                                        src={product.image}
                                        alt={`${product.title} X-Ray`}
                                        style={{ skewY: skew, filter: "grayscale(1) invert(1) sepia(1) hue-rotate(130deg) saturate(300%) brightness(150%) contrast(150%)" }}
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                        loading="lazy"
                                    />
                                </motion.div>

                                {/* Scanning Line */}
                                <motion.div
                                    variants={{
                                        rest: { top: "0%", opacity: 0 },
                                        hover: { top: ["0%", "100%"], opacity: [0, 1, 1, 0] }
                                    }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 w-full h-[2px] bg-neon-blue shadow-[0_0_15px_#00f3ff] z-20 pointer-events-none"
                                />

                                {/* Desktop HUD Overlay */}
                                <motion.div
                                    variants={{
                                        rest: { opacity: 0 },
                                        hover: { opacity: 1 }
                                    }}
                                    className="absolute inset-0 pointer-events-none z-20 hidden sm:block"
                                >
                                    {/* SVG Connectors */}
                                    <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                        <motion.line variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.4, delay: 0.2 }} x1="20%" y1="15%" x2="40%" y2="40%" stroke="#00f3ff" strokeWidth="1" opacity="0.4" />
                                        <motion.line variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.4, delay: 0.3 }} x1="80%" y1="15%" x2="60%" y2="40%" stroke="#00f3ff" strokeWidth="1" opacity="0.4" />
                                        <motion.line variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.4, delay: 0.4 }} x1="20%" y1="75%" x2="40%" y2="60%" stroke="#00f3ff" strokeWidth="1" opacity="0.4" />
                                        <motion.line variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }} transition={{ duration: 0.4, delay: 0.5 }} x1="80%" y1="75%" x2="60%" y2="60%" stroke="#00f3ff" strokeWidth="1" opacity="0.4" />

                                        {/* Center Reticle */}
                                        <motion.circle variants={{ rest: { scale: 0, opacity: 0 }, hover: { scale: 1, opacity: 0.3 } }} transition={{ duration: 0.3, delay: 0.1 }} cx="50%" cy="50%" r="5%" stroke="#ff00ff" strokeWidth="1" fill="transparent" />
                                        <motion.circle variants={{ rest: { rotate: 0, opacity: 0 }, hover: { rotate: 180, opacity: 0.5 } }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} cx="50%" cy="50%" r="15%" stroke="#00f3ff" strokeWidth="0.5" strokeDasharray="4 12" fill="transparent" style={{ transformOrigin: "50% 50%" }} />
                                    </svg>

                                    {/* Four Corners HUD Stats */}
                                    <div className="absolute top-[10%] left-[5%]">
                                        <TypewriterText text={`WGT:${product.weight}`} delayOffset={0.2} />
                                    </div>
                                    <div className="absolute top-[10%] right-[5%] flex justify-end">
                                        <TypewriterText text={`MAT:${product.material.substring(0, 8)}`} delayOffset={0.3} rightAlign={true} />
                                    </div>
                                    <div className="absolute top-[75%] left-[5%]">
                                        <TypewriterText text={`SPD:${product.speedRating}`} delayOffset={0.4} />
                                    </div>
                                    <div className="absolute top-[75%] right-[5%] flex justify-end">
                                        <TypewriterText text={`PWR:${product.rating.toFixed(1)}`} delayOffset={0.5} rightAlign={true} />
                                    </div>
                                </motion.div>

                                {product.stock < 20 && (
                                    <div className="absolute top-3 left-3 bg-neon-pink text-white text-xs font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wider backdrop-blur-sm z-30">
                                        Low Stock
                                    </div>
                                )}

                                {/* Stash/Wishlist Button */}
                                <motion.button
                                    whileTap={{ scale: [1, 1.4, 1] }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        toggleWishlist(product);
                                        if (!isStashed) {
                                            showToast('ITEM SECURED TO ARCHIVE');
                                        }
                                    }}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-dark-900/80 backdrop-blur-md border border-dark-600 hover:border-neon-pink transition-all z-30 group/heart"
                                >
                                    <Heart
                                        size={18}
                                        className={`transition-colors duration-300 ${isStashed ? 'fill-neon-pink text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,60,0.8)]' : 'text-gray-400 group-hover/heart:text-neon-pink'}`}
                                    />
                                </motion.button>

                                {/* Quick View Button */}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setIsQuickViewOpen(true);
                                    }}
                                    className="absolute top-14 right-3 p-2 rounded-full bg-dark-900/80 backdrop-blur-md border border-dark-600 hover:border-neon-blue transition-all z-30 group/scan"
                                >
                                    <Scan size={18} className="text-gray-400 group-hover/scan:text-neon-blue transition-colors" />
                                </motion.button>

                                {/* Quick Add overlay button */}
                                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-dark-900 to-transparent z-30">
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full bg-white text-dark-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-neon-blue transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
                                    >
                                        <ShoppingCart size={18} /> Quick Add
                                    </button>
                                </div>
                            </motion.div>

                            {/* Content Details */}
                            <div className={`p-5 flex flex-col flex-grow ${isHorizontal ? 'w-1/2 justify-center' : ''} ${isLarge ? 'md:p-8' : ''}`}>
                                <div className="text-xs text-neon-purple font-medium mb-2 tracking-widest uppercase">
                                    {product.category}
                                </div>
                                <h3 className={`font-semibold text-white mb-2 leading-snug group-hover:text-neon-blue transition-colors ${isLarge ? 'text-2xl md:text-3xl line-clamp-2' : (isHorizontal ? 'text-xl' : 'text-lg line-clamp-2')}`}>
                                    {product.title}
                                </h3>

                                {(isHorizontal || isLarge) && (
                                    <p className={`text-gray-400 mt-2 mb-4 hidden sm:block ${isLarge ? 'text-base line-clamp-4' : 'text-sm line-clamp-3'}`}>
                                        {product.description}
                                    </p>
                                )}

                                <div className="mt-auto pt-4 flex items-center justify-between">
                                    <div className={`font-bold text-white tracking-tight ${isLarge ? 'text-3xl' : 'text-xl'}`}>
                                        ${product.price.toFixed(2)}
                                    </div>
                                    <div className="flex items-center text-gray-400 text-sm">
                                        <Star className="w-4 h-4 text-neon-green fill-neon-green mr-1" />
                                        <span>{product.rating}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Flying Image Portal */}
                {isFlying && createPortal(
                    <motion.img
                        src={product.image}
                        className="fixed z-[99999] rounded-xl shadow-[0_0_30px_#00f3ff] object-cover pointer-events-none mix-blend-screen"
                        initial={{
                            top: startCoords.top,
                            left: startCoords.left,
                            width: startCoords.width,
                            height: startCoords.width, // assuming square
                            opacity: 0.8,
                            filter: "brightness(2) drop-shadow(0 0 10px #00f3ff) hue-rotate(90deg)"
                        }}
                        animate={{
                            top: 25,
                            left: window.innerWidth - (window.innerWidth < 768 ? 70 : 150), // Approx dist to Navbar cart
                            width: 20,
                            height: 20,
                            opacity: 0,
                            scale: 0.1
                        }}
                        transition={{
                            duration: 0.7,
                            top: { ease: "easeIn", duration: 0.7 }, // Accelerate up
                            left: { ease: "easeOut", duration: 0.7 }, // Decelerate right (forms curve)
                            opacity: { ease: "easeIn", duration: 0.5, delay: 0.2 }
                        }}
                    />,
                    document.body
                )}
            </Link>
            {/* Quick View Modal rendered outside the Link logic internally but visually attached */}
            <Modal
                isOpen={isQuickViewOpen}
                onClose={() => setIsQuickViewOpen(false)}
                title="Quick Data Access"
                maxWidth="max-w-3xl"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-[110]">
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-dark-900 border border-dark-700 relative">
                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 border-2 border-neon-blue/20 rounded-xl" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-neon-blue text-xs font-bold uppercase tracking-widest bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/20 self-start mb-4">
                            {product.category}
                        </span>
                        <h2 className="text-3xl font-display font-bold text-white mb-2">{product.title}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-4 h-4 text-neon-green fill-neon-green" />
                            <span className="text-gray-300 font-medium text-sm">{product.rating}</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-4">${product.price.toFixed(2)}</div>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed flex-grow">{product.description}</p>
                        <div className="mt-auto">
                            <button
                                onClick={(e) => {
                                    handleAddToCart(e);
                                    setIsQuickViewOpen(false);
                                }}
                                className="w-full bg-neon-blue text-dark-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all uppercase tracking-wider"
                            >
                                <ShoppingCart size={18} /> Biometric Add to Cart
                            </button>
                            <Link
                                to={`/product/${product.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="block w-full text-center mt-4 text-sm text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-bold"
                            >
                                View Full Details
                            </Link>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProductCard;
