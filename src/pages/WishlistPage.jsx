import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Users, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const SupplyWatchMeter = ({ productId }) => {
    // Generate a consistent pseudo-random number based on the product ID
    // so it doesn't change wildly every re-render, but looks dynamic per item.
    const interestLevel = React.useMemo(() => {
        let hash = 0;
        for (let i = 0; i < productId.length; i++) {
            hash = productId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return Math.abs(hash % 78) + 14; // Gives a number between 14 and 91
    }, [productId]);

    const isHighDemand = interestLevel > 60;

    return (
        <div className="mt-4 bg-dark-800/80 border border-dark-600 rounded-lg p-3 flex items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2">
                {isHighDemand ? (
                    <Flame size={16} className="text-neon-pink animate-pulse" />
                ) : (
                    <Users size={16} className="text-neon-blue" />
                )}
                <span className="text-xs font-mono text-gray-300">
                    <span className={isHighDemand ? "text-neon-pink font-bold" : "text-white font-bold"}>{interestLevel}</span> others tracking this item
                </span>
            </div>
            {isHighDemand && (
                <span className="text-[9px] uppercase tracking-widest bg-neon-pink/20 text-neon-pink px-2 py-0.5 rounded border border-neon-pink/50 backdrop-blur-sm">
                    High Demand
                </span>
            )}
        </div>
    );
};

const WishlistPage = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 min-h-[80vh]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4 border-b border-dark-700 pb-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">
                        Personal <span className="text-neon-pink">Archive</span>
                    </h1>
                    <p className="text-gray-400 text-sm mt-2 font-mono uppercase tracking-widest">
                        {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'} Secured
                    </p>
                </div>
                <Link to="/products" className="btn-secondary flex items-center gap-2 text-sm">
                    <ArrowLeft size={16} /> RETURN TO DATABASE
                </Link>
            </div>

            {wishlist.length === 0 ? (
                /* Empty State showing the Glitch Graphic */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center justify-center py-20 bg-dark-800/30 rounded-3xl border border-dark-600/50 backdrop-blur-sm shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]"
                >
                    <div className="relative mb-8 group">
                        {/* Glitch layers */}
                        <motion.div
                            animate={{ x: [-2, 2, -2], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
                            className="absolute inset-0 text-neon-pink opacity-50 blur-[2px] z-0 pointer-events-none"
                        >
                            <AlertTriangle size={80} strokeWidth={1} />
                        </motion.div>
                        <motion.div
                            animate={{ x: [2, -2, 2], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 0.3, ease: "linear", delay: 0.1 }}
                            className="absolute inset-0 text-neon-blue opacity-50 blur-[2px] z-0 pointer-events-none"
                        >
                            <AlertTriangle size={80} strokeWidth={1} />
                        </motion.div>

                        {/* Core icon */}
                        <AlertTriangle size={80} className="text-dark-400 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" strokeWidth={1} />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 text-center">
                        Archive Devoid Of Data
                    </h2>
                    <p className="text-dark-400 text-center max-w-md font-mono text-sm mb-8 leading-relaxed">
                        SYSTEM LOG_0X9A: NO TARGETS ACQUIRED. INITIATE SCAN OF THE MAIN DATABASE TO SECURE HARDWARE TO YOUR PERSONAL STASH.
                    </p>
                    <Link to="/products" className="btn-primary hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all">
                        INITIATE SCAN
                    </Link>
                </motion.div>
            ) : (
                /* Product Grid */
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: { staggerChildren: 0.1 }
                        }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {wishlist.map(product => (
                        <motion.div
                            key={product.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            className="flex flex-col h-full gap-2"
                        >
                            <div className="flex-1">
                                <ProductCard product={product} />
                            </div>
                            <SupplyWatchMeter productId={product.id} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default WishlistPage;
