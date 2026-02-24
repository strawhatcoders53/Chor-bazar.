import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { stitchStream } from '../utils/mockStitchStream';
import { Activity } from 'lucide-react';

const GlobalPulseMap = () => {
    const [pings, setPings] = useState([]);
    const [uplinks, setUplinks] = useState([]);

    useEffect(() => {
        const handleDbChange = (event) => {
            const data = event.detail;

            // Only show "purchased" or "added" as significant uplinks, or just all of them to keep it busy

            // Generate random coordinates for the ping (simulating a global hit)
            // Constrain slightly to avoid hitting the exact edges
            const x = Math.floor(Math.random() * 80) + 10;
            const y = Math.floor(Math.random() * 70) + 15;

            const newPing = {
                id: data.id,
                x,
                y,
                timestamp: data.timestamp
            };

            const newUplink = {
                id: data.id,
                uuid: data.id + '-' + Math.random().toString(36).substr(2, 9),
                productName: data.productName || "Unknown Asset",
                city: data.city || "Unknown Sector",
                type: data.type
            };

            setPings(prev => [...prev, newPing].slice(-5)); // Keep last 5 pings
            setUplinks(prev => [newUplink, ...prev].slice(0, 4)); // Keep last 4 uplinks in feed

            // Auto remove ping after animation finishes
            setTimeout(() => {
                setPings(prev => prev.filter(p => p.id !== data.id));
            }, 3000);
        };

        stitchStream.addEventListener('stitch-db-change', handleDbChange);

        return () => {
            stitchStream.removeEventListener('stitch-db-change', handleDbChange);
        };
    }, []);

    // Highly simplified world map path for aesthetic purposes
    const worldMapPath = "M12.9,34.4l-1.9,1.7l-2.6-0.3l-1.3-1.6l0.3-2.1l1.6-1.1l2.5,0.4l1.3,1.4 L12.9,34.4z M20.9,43.4l-1.3,1.6l-2.4-0.1l-1.4-1.4l0.2-2.3l1.8-1.4l2.5,0.2l1.3,1.6l-0.1,2.1L20.9,43.4z M32.9,25.4l-1.1,1.8l-2.2-0.2 l-1.2-1.5l0.4-2.1l1.7-1l2.3,0.3l1.1,1.7l-0.2,2.2L32.9,25.4z M40.9,31.4l-1.3,1.6l-2.4-0.1l-1.4-1.4l0.2-2.3l1.8-1.4l2.5,0.2l1.3,1.6 l-0.1,2.1L40.9,31.4z M52.9,18.4l-1.1,1.8l-2.2-0.2l-1.2-1.5l0.4-2.1l1.7-1l2.3,0.3l1.1,1.7l-0.2,2.2L52.9,18.4z M60.9,25.4l-1.3,1.6 l-2.4-0.1l-1.4-1.4l0.2-2.3l1.8-1.4l2.5,0.2l1.3,1.6l-0.1,2.1L60.9,25.4z M72.9,15.4l-1.1,1.8l-2.2-0.2l-1.2-1.5l0.4-2.1l1.7-1 l2.3,0.3l1.1,1.7l-0.2,2.2L72.9,15.4z M80.9,22.4l-1.3,1.6l-2.4-0.1l-1.4-1.4l0.2-2.3l1.8-1.4l2.5,0.2l1.3,1.6l-0.1,2.1L80.9,22.4z M92.9,18.4l-1.1,1.8l-2.2-0.2l-1.2-1.5l0.4-2.1l1.7-1l2.3,0.3l1.1,1.7l-0.2,2.2L92.9,18.4z M8.96,52.4l0.87-1.18l2.09,1.1 l-0.45,2.44l-2.4-0.64L8.96,52.4z M15.53,58.82l0.47,1.85l1.69-0.96l-0.91-1.68L15.53,58.82z M45.47,48.82l0.47,1.85 l1.69-0.96l-0.91-1.68L45.47,48.82z M82.47,41.82l0.47,1.85l1.69-0.96l-0.91-1.68L82.47,41.82z M70.47,60.82l0.47,1.85l1.69-0.96 l-0.91-1.68L70.47,60.82z M12.8,12.86l1.24-0.81l2,1.3l-0.6,2.37l-2.3-0.8L12.8,12.86z M30.8,9.86l1.24-0.81l2,1.3l-0.6,2.37 l-2.3-0.8L30.8,9.86z M50.8,5.86l1.24-0.81l2,1.3l-0.6,2.37l-2.3-0.8L50.8,5.86z M70.8,8.86l1.24-0.81l2,1.3l-0.6,2.37 l-2.3-0.8L70.8,8.86z M90.8,5.86l1.24-0.81l2,1.3l-0.6,2.37l-2.3-0.8L90.8,5.86z";

    // Adding more paths to roughly represent a highly stylized tech map grid
    const mapGridD = "M0 10 H100 M0 20 H100 M0 30 H100 M0 40 H100 M0 50 H100 M0 60 H100 M0 70 H100 M0 80 H100 M0 90 H100 M10 0 V100 M20 0 V100 M30 0 V100 M40 0 V100 M50 0 V100 M60 0 V100 M70 0 V100 M80 0 V100 M90 0 V100";

    return (
        <div className="bg-dark-900 border border-dark-700 rounded-2xl overflow-hidden relative glass-panel w-full">
            {/* Header */}
            <div className="px-6 py-4 border-b border-dark-700 flex items-center justify-between relative z-10 bg-dark-800/80">
                <div className="flex items-center gap-3">
                    <Activity className="text-neon-blue w-5 h-5 flex-shrink-0" />
                    <h3 className="text-white font-display font-bold tracking-widest uppercase text-sm md:text-base">
                        Global Uplink Node
                    </h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-blue"></span>
                    </span>
                    <span className="text-[10px] text-neon-blue font-mono font-bold tracking-widest uppercase">
                        Live Tracking
                    </span>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative w-full aspect-[2/1] bg-dark-950 overflow-hidden">
                {/* Simplified World Map SVG */}
                <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-30">
                    <path d={mapGridD} stroke="#004466" strokeWidth="0.1" fill="none" />

                    {/* A highly simplified dotted path representation of world continents */}
                    <path d="M 20 20 Q 30 10 40 20 T 60 20 T 80 10" stroke="#00f3ff" strokeWidth="0.3" strokeDasharray="1 2" fill="none" opacity="0.5" />
                    <path d="M 15 30 Q 25 35 20 50 T 25 65" stroke="#00f3ff" strokeWidth="0.3" strokeDasharray="1 2" fill="none" opacity="0.5" />
                    <path d="M 45 30 Q 55 40 60 50 T 70 65" stroke="#00f3ff" strokeWidth="0.3" strokeDasharray="1 2" fill="none" opacity="0.5" />
                    <path d="M 70 30 Q 85 45 90 40 T 95 60" stroke="#00f3ff" strokeWidth="0.3" strokeDasharray="1 2" fill="none" opacity="0.5" />

                    {/* More abstract data lines */}
                    <path d="M 10 40 C 30 50, 40 20, 60 30 C 80 40, 90 20, 100 30" stroke="#004466" strokeWidth="0.2" fill="none" />
                    <path d={worldMapPath} fill="none" stroke="#00f3ff" strokeWidth="0.4" opacity="0.7" transform="scale(0.8) translate(10, 10)" />
                </svg>

                {/* Sweeping Radar gradient */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 origin-center opacity-20 pointer-events-none"
                    style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(0, 243, 255, 0.4) 360deg)' }}
                />

                {/* Pings */}
                <AnimatePresence>
                    {pings.map(ping => (
                        <motion.div
                            key={ping.id}
                            className="absolute z-20"
                            style={{ left: `${ping.x}%`, top: `${ping.y}%`, transform: 'translate(-50%, -50%)' }}
                        >
                            <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 4, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="absolute w-4 h-4 rounded-full border border-neon-blue"
                            />
                            <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                className="absolute w-4 h-4 rounded-full bg-neon-blue/50 block"
                            />
                            <div className="w-1.5 h-1.5 bg-neon-blue rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#00f3ff]" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Live Scrolling Feed */}
            <div className="bg-dark-800 p-4 relative z-10 h-32 overflow-hidden border-t border-dark-700">
                <div className="absolute left-6 top-4 bottom-4 w-px bg-dark-600"></div>

                <AnimatePresence>
                    {uplinks.map((uplink) => (
                        <motion.div
                            key={uplink.uuid}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            layout
                            className="flex items-start gap-4 mb-3 relative"
                        >
                            <div className="mt-1.5 w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_5px_#00f3ff] relative z-10 shrink-0" />
                            <div className="text-sm">
                                <span className="text-white font-medium">Uplink: {uplink.productName} </span>
                                <span className="text-gray-400">synchronized in </span>
                                <span className="text-neon-pink font-mono tracking-wide">{uplink.city}</span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {uplinks.length === 0 && (
                    <div className="text-gray-500 font-mono text-xs flex items-center h-full pl-6">
                        AWAITING INCOMING TELEMETRY...
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalPulseMap;
