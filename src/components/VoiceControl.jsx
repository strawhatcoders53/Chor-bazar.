import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Waves } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import products from '../data/products.json';

const VoiceControl = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isSupported, setIsSupported] = useState(true);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();
    const { addToCart, showToast } = useCart();

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setIsSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
        };

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const resultTranscript = event.results[current][0].transcript;
            setTranscript(resultTranscript);
            processCommand(resultTranscript.toLowerCase());
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
            if (event.error === 'not-allowed') {
                showToast('Microphone access denied. Please enable it in browser settings.');
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [showToast]);

    const processCommand = useCallback((command) => {
        console.log('Processing command:', command);

        if (command.includes('open archive') || command.includes('go to products') || command.includes('show products')) {
            navigate('/products');
            showToast('Navigating to Archive...');
            return;
        }

        if (command.includes('add') && command.includes('to cart')) {
            // RegEx to extract product name: "add [product] to cart"
            const match = command.match(/add (.+) to cart/);
            if (match && match[1]) {
                const productName = match[1].trim();
                const foundProduct = products.find(p =>
                    p.title.toLowerCase().includes(productName) ||
                    productName.includes(p.title.toLowerCase())
                );

                if (foundProduct) {
                    addToCart(foundProduct);
                    showToast(`AI Recognition: Adding ${foundProduct.title} to storage.`);
                } else {
                    showToast(`System Error: Product "${productName}" not found in database.`);
                }
            }
            return;
        }

        if (command.length > 0) {
            showToast(`Command not recognized: "${command}"`);
        }
    }, [navigate, addToCart, showToast]);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            try {
                recognitionRef.current?.start();
            } catch (err) {
                console.error('Recognition start error', err);
            }
        }
    };

    // Show the component even if unsupported to provide feedback to the user.

    return (
        <div className="flex flex-col items-center gap-2 mt-4 group">
            <button
                onClick={toggleListening}
                disabled={!isSupported}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${!isSupported
                    ? 'bg-dark-800 border border-red-900/50 text-red-500/60 cursor-not-allowed'
                    : isListening
                        ? 'bg-neon-pink shadow-[0_0_20px_rgba(255,0,60,0.6)] animate-pulse'
                        : 'bg-dark-800 border border-dark-600 hover:border-neon-blue/50 text-gray-400 hover:text-white'
                    }`}
                title={!isSupported ? 'Speech Recognition Not Supported in this Browser (Use Chrome/Edge)' : isListening ? 'Listening...' : 'Activate Voice Command'}
            >
                {isListening ? (
                    <Mic className="w-5 h-5 text-white" />
                ) : (
                    <MicOff className={`w-5 h-5 ${!isSupported ? 'opacity-80 text-red-500/50' : ''}`} />
                )}

                {/* Rotating Ring while listening */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1.2 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 rounded-full border-2 border-neon-pink opacity-20"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full border-t-2 border-neon-pink rounded-full"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>

            {/* Audio Wave Visualizer */}
            <div className="h-6 flex items-center gap-0.5 px-2">
                <AnimatePresence>
                    {isListening ? (
                        <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 2 }}
                                    animate={{ height: [4, 12, 6, 16, 4] }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: "easeInOut"
                                    }}
                                    className="w-1 bg-neon-pink rounded-full"
                                />
                            ))}
                        </div>
                    ) : (
                        <span className="text-[8px] text-gray-600 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                            AI // VOICE
                        </span>
                    )}
                </AnimatePresence>
            </div>

            {/* Transcript Tooltip */}
            <AnimatePresence>
                {isListening && transcript && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute right-14 bg-dark-900/90 border border-neon-pink/30 px-3 py-1.5 rounded-lg backdrop-blur-md shadow-2xl pointer-events-none"
                    >
                        <p className="text-[10px] lowercase text-neon-pink font-mono italic">
                            {transcript}...
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VoiceControl;
