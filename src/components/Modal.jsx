import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-dark-900/80 backdrop-blur-sm"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 10 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 10 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`bg-dark-800 border border-dark-600 rounded-2xl w-full ${maxWidth} overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] cursor-default`}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation(); // Prevent clicks inside from closing overlay or triggering router Links
                        }}
                    >
                        {/* Header */}
                        <div className="flex flex-row items-center justify-between p-4 border-b border-dark-700 bg-dark-800/50">
                            <h3 className="text-xl font-display font-bold text-white tracking-wider uppercase">
                                {title}
                            </h3>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onClose();
                                }}
                                className="transition-colors px-2 py-1 rounded hover:bg-neon-pink/10 group border border-transparent hover:border-neon-pink/50"
                            >
                                <span className="font-mono text-sm tracking-widest text-neon-pink group-hover:text-neon-pink transition-colors font-bold">[X]</span>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Add to tailwind config or global css
// @keyframes fadeIn {
//   from { opacity: 0; }
//   to { opacity: 1; }
// }
// @keyframes slideUp {
//   from { transform: translateY(20px); opacity: 0; }
//   to { transform: translateY(0); opacity: 1; }
// }

export default Modal;
