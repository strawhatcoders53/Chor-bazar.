import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Send, User } from 'lucide-react';

// Sub-component: The Digital Signal Meter (replaces star ratings)
const SignalMeter = ({ rating, size = "md", interactive = false, onRate = () => { } }) => {
    const bars = [1, 2, 3, 4, 5];

    // Size variants
    const sizes = {
        sm: "w-1.5 h-3",
        md: "w-2.5 h-5",
        lg: "w-4 h-8"
    };

    return (
        <div className="flex items-end gap-1">
            {bars.map((bar) => {
                const isActive = bar <= rating;
                const heightScale = 0.4 + (bar * 0.15); // Bars get progressively taller

                return (
                    <button
                        key={bar}
                        type={interactive ? "button" : "submit"}
                        disabled={!interactive}
                        onClick={() => interactive && onRate(bar)}
                        className={`
                            transition-all duration-300 rounded-sm
                            ${sizes[size]} 
                            ${interactive ? 'cursor-pointer hover:bg-neon-green/80' : 'cursor-default'}
                            ${isActive
                                ? 'bg-neon-green shadow-[0_0_10px_rgba(0,255,128,0.6)]'
                                : 'bg-dark-600 border border-dark-500'}
                        `}
                        style={{ transform: `scaleY(${heightScale})`, transformOrigin: 'bottom' }}
                    />
                );
            })}
        </div>
    );
};

// Main Component
const ReviewSection = ({ productId }) => {
    // Simulated database of existing Comms Logs (Reviews)
    const [reviews, setReviews] = useState([
        {
            id: 1,
            user: "N3ON_RIDER",
            rating: 5,
            text: "Material quality is exceptional. Hydro-repellent coating holds up under urban acid rain. Worth the credits.",
            date: "2026.11.04",
            verified: true
        },
        {
            id: 2,
            user: "GHOST_X",
            rating: 4,
            text: "Solid build. The thermal lining is efficient. Shipping drone dropped it off 2 sectors away though.",
            date: "2026.10.28",
            verified: true
        },
        {
            id: 3,
            user: "SYS_ADMIN_99",
            rating: 5,
            text: "Flawless aesthetic. Fully compatible with my rig setup.",
            date: "2026.10.15",
            verified: false
        }
    ]);

    const [newLog, setNewLog] = useState("");
    const [newRating, setNewRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newLog.trim()) return;

        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            const logEntry = {
                id: Date.now(),
                user: "LOCAL_USER_" + Math.floor(Math.random() * 1000),
                rating: newRating,
                text: newLog,
                date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
                verified: true // Assume logged-in purchaser for demo
            };

            setReviews([logEntry, ...reviews]);
            setNewLog("");
            setNewRating(5);
            setIsSubmitting(false);
        }, 600);
    };

    return (
        <div id="reviews-section" className="mt-16 w-full max-w-4xl mx-auto scroll-m-24">
            <div className="flex items-center gap-3 mb-8 border-b border-dark-600 pb-4">
                <h2 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                    Encrypted <span className="text-neon-blue">Comms Logs</span>
                </h2>
                <span className="text-gray-500 font-mono text-xs">[{reviews.length} ENTRIES FOUND]</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Input Column */}
                <div className="md:col-span-1">
                    <div className="bg-dark-800/50 border border-dark-600 p-6 rounded-xl backdrop-blur-sm sticky top-28">
                        <h3 className="text-neon-pink font-mono text-sm uppercase tracking-wider mb-4 border-b border-dark-600/50 pb-2">
                            &gt; Transmit Log
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-400 text-xs font-mono uppercase mb-2">Signal Strength</label>
                                <SignalMeter rating={newRating} interactive={true} onRate={setNewRating} size="lg" />
                            </div>

                            <div>
                                <label className="block text-gray-400 text-xs font-mono uppercase mb-2">Transmission Data</label>
                                <textarea
                                    value={newLog}
                                    onChange={(e) => setNewLog(e.target.value)}
                                    placeholder="Enter your experience parameters here..."
                                    className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-gray-300 font-mono text-sm focus:outline-none focus:border-neon-blue custom-scrollbar transition-colors h-32 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || !newLog.trim()}
                                className="w-full btn-primary py-3 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <span className="animate-pulse">UPLOADING...</span>
                                ) : (
                                    <>
                                        <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        <span>BROADCAST LOG</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Feed Column */}
                <div className="md:col-span-2 space-y-4">
                    <AnimatePresence>
                        {reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-dark-900/40 border border-dark-600 hover:border-neon-blue/50 rounded-xl p-5 backdrop-blur-md transition-colors relative overflow-hidden group"
                            >
                                {/* Subtle neon accent line tied to rating */}
                                <div className={`absolute top-0 left-0 w-1 h-full ${review.rating >= 4 ? 'bg-neon-green' : review.rating === 3 ? 'bg-neon-blue' : 'bg-neon-pink'} opacity-50 group-hover:opacity-100 transition-opacity`} />

                                <div className="flex justify-between items-start mb-4 pl-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-dark-700 border border-dark-500 flex items-center justify-center text-gray-400">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-mono text-sm">{review.user}</h4>
                                            <p className="text-gray-500 text-[10px] font-mono tracking-widest">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <SignalMeter rating={review.rating} size="sm" />
                                        {review.verified && (
                                            <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-neon-blue bg-neon-blue/10 px-2 py-0.5 rounded border border-neon-blue/30">
                                                <ShieldCheck size={10} /> Verified Uplink
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-400 text-sm leading-relaxed pl-3 font-light">
                                    "{review.text}"
                                </p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};

export default ReviewSection;
