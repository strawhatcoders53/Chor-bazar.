import { motion } from 'framer-motion';
import { MapPin, Navigation, Orbit } from 'lucide-react';

const DeliveryTracker = () => {
    return (
        <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 w-full max-w-2xl mx-auto my-8 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-white font-display font-bold uppercase tracking-widest text-lg flex items-center gap-2">
                    <Orbit className="w-5 h-5 text-neon-blue animate-spin-slow" />
                    Delivery Logistics
                </h3>
                <div className="bg-dark-900 border border-dark-700 px-3 py-1.5 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-neon-green shadow-neon-green animate-pulse"></div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Drone En Route</span>
                </div>
            </div>

            {/* Map Container */}
            <div className="relative aspect-[21/9] bg-dark-900/50 rounded-xl border border-dark-700 p-4 pointer-events-none">
                {/* SVG Graph/Map */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Underlying Route Paths (Faded) */}
                    <path
                        d="M 10 80 Q 30 20 60 50 T 90 20"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="0.5"
                    />
                    <path
                        d="M 10 20 Q 40 80 80 80"
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.05)"
                        strokeWidth="0.5"
                    />

                    {/* The Active Delivery Route */}
                    <motion.path
                        d="M 10 50 Q 30 10 60 50 T 90 50"
                        fill="none"
                        stroke="#00f3ff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 5px rgba(0, 240, 255, 0.8))' }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
                    />

                    {/* Pulsing Drone Element moving along path */}
                    <motion.circle
                        r="2"
                        fill="#ffffff"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 1))' }}
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
                    >
                        <animateMotion
                            dur="4s"
                            path="M 10 50 Q 30 10 60 50 T 90 50"
                            calcMode="spline"
                            keyTimes="0;1"
                            keySplines="0.42 0.0 0.58 1.0"
                            fill="freeze"
                            begin="1s"
                        />
                    </motion.circle>
                </svg>

                {/* Nodes */}
                {/* Origin: Sector 7 Warehouse */}
                <div className="absolute left-[10%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-dark-800 border-2 border-neon-pink flex items-center justify-center relative z-10 shadow-neon-pink">
                            <Navigation className="w-4 h-4 text-neon-pink" />
                        </div>
                        <div className="absolute inset-0 w-8 h-8 rounded-full bg-neon-pink opacity-50 animate-ping"></div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono text-center max-w-[80px]">Sector 7 Depot</span>
                </div>

                {/* Destination: User Node */}
                <div className="absolute right-[10%] top-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-dark-800 border-2 border-white flex items-center justify-center relative z-10">
                        <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-[10px] text-white font-mono text-center bg-dark-800 border border-dark-600 px-2 py-0.5 rounded shadow-lg max-w-[80px]">User Node</span>
                </div>
            </div>

            {/* Status Footer */}
            <div className="mt-4 flex justify-between items-center text-xs font-mono text-gray-500 border-t border-dark-700 pt-4">
                <span className="uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-neon-pink rounded-full inline-block"></span>
                    Origin
                </span>
                <span className="uppercase tracking-widest text-[#00f3ff] animate-pulse">
                    ETA: 24h
                </span>
                <span className="uppercase tracking-widest flex items-center gap-1">
                    Destination
                    <span className="w-1.5 h-1.5 bg-white rounded-full inline-block"></span>
                </span>
            </div>

        </div>
    );
};

export default DeliveryTracker;
