import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, X } from 'lucide-react';
import { stitchStream } from '../utils/mockStitchStream';

const LivePulse = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Start the mock database stream
        stitchStream.start();

        // Event listener for the stream
        const handleDbChange = (event) => {
            const newNotification = event.detail;

            setNotifications(prev => {
                // Keep max 3 notifications on screen
                const updated = [newNotification, ...prev];
                return updated.slice(0, 3);
            });

            // Auto-dismiss after 8 seconds
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
            }, 8000);
        };

        stitchStream.addEventListener('stitch-db-change', handleDbChange);

        return () => {
            stitchStream.removeEventListener('stitch-db-change', handleDbChange);
            stitchStream.stop();
        };
    }, []);

    const dismissNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed bottom-16 left-6 z-50 flex flex-col-reverse gap-3 pointer-events-none w-80">
            <AnimatePresence>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -50, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } }}
                        className="bg-dark-800/90 backdrop-blur-md border border-dark-600 rounded-xl p-3 shadow-[0_4_20px_rgba(0,0,0,0.5)] pointer-events-auto flex items-start gap-3 relative overflow-hidden group"
                    >
                        {/* Top accent line */}
                        <div className={`absolute top-0 left-0 w-full h-0.5 ${notification.type === 'purchased' ? 'bg-neon-pink shadow-[0_0_10px_#ff003c]' : 'bg-neon-blue shadow-[0_0_10px_#00f0ff]'}`} />

                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-dark-900 border border-dark-700">
                            {notification.productImage ? (
                                <img src={notification.productImage} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <Activity className="w-5 h-5 m-2.5 text-neon-blue" />
                            )}
                        </div>

                        <div className="flex-grow pr-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-green opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-green"></span>
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neon-green">Live Pulse</span>
                            </div>
                            <p className="text-gray-200 text-xs font-medium leading-relaxed">
                                {notification.message}
                            </p>
                        </div>

                        <button
                            onClick={() => dismissNotification(notification.id)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default LivePulse;
