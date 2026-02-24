import { CheckCircle2, X } from 'lucide-react';

const ToastNotification = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-[slideIn_0.3s_ease-out]">
            <div className="bg-dark-800 border border-neon-green/50 shadow-[0_0_15px_rgba(0,255,102,0.15)] rounded-xl p-4 flex items-center gap-3 w-72">
                <div className="bg-neon-green/10 p-2 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-neon-green" />
                </div>
                <p className="text-white text-sm font-medium flex-grow">{message}</p>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Add this to your tailwind config or global CSS:
// @keyframes slideIn {
//   from { transform: translateX(100%); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }

export default ToastNotification;
