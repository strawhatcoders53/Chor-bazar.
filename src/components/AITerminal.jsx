import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Send, Cpu } from 'lucide-react';
import { getOverseerResponse } from '../services/aiService';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import products from '../data/products.json';

const TypewriterText = ({ text, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayedText((prev) => prev + text.charAt(index));
            index++;
            if (index >= text.length) {
                clearInterval(interval);
                if (onComplete) onComplete();
            }
        }, 20); // ms per character

        return () => clearInterval(interval);
    }, [text, onComplete]);

    return <span>{displayedText}</span>;
};

const AITerminal = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'ai', text: 'System initialized. I am Overseer. State your query.', isTyping: true }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const { addToCart, showToast } = useCart();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const executeAICommand = (aiResponse) => {
        try {
            // Check if there are any JSON brackets at all
            if (!aiResponse.includes('{') || !aiResponse.includes('}')) {
                return;
            }

            // Find JSON block using Regex
            const jsonMatch = aiResponse.match(/\{.*\}/s);
            if (!jsonMatch) return;

            const actionObj = JSON.parse(jsonMatch[0]);

            switch (actionObj.action) {
                case 'NAVIGATE':
                    if (actionObj.path) {
                        setTimeout(() => {
                            navigate(actionObj.path);
                            showToast(`Overseer Executed: Routing to ${actionObj.path}`);
                            onClose();
                        }, 1000);
                    }
                    break;

                case 'ADD':
                    if (actionObj.item) {
                        const productName = actionObj.item.toLowerCase();
                        const foundProduct = products.find(p =>
                            p.title.toLowerCase().includes(productName) || productName.includes(p.title.toLowerCase())
                        );

                        if (foundProduct) {
                            setTimeout(() => {
                                addToCart(foundProduct);
                                showToast(`Overseer Executed: Added ${foundProduct.title} to storage.`);
                            }, 1000);
                        } else {
                            setTimeout(() => showToast(`Overseer Notice: Target "${actionObj.item}" not found in inventory.`), 1000);
                        }
                    }
                    break;

                default:
                    console.warn("Unknown AI action received:", actionObj.action);
            }
        } catch (e) {
            console.error("Failed to parse or execute AI command", e);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userText = inputValue;
        setInputValue('');

        const newUserMsg = { id: Date.now(), role: 'user', text: userText };
        setMessages((prev) => [...prev, newUserMsg]);
        setIsTyping(true);

        const aiResponseRaw = await getOverseerResponse(userText);

        // Strip out the JSON from the displayed text if present
        let displayText = aiResponseRaw;
        const match = aiResponseRaw.match(/\{.*\}/s);
        if (match) {
            displayText = aiResponseRaw.replace(match[0], '').trim();
        }

        const newAiMsg = { id: Date.now() + 1, role: 'ai', text: displayText, raw: aiResponseRaw, isTyping: true };
        setMessages((prev) => [...prev, newAiMsg]);
    };

    const handleTypingComplete = (msgId, rawFeedback) => {
        setMessages((prev) =>
            prev.map(m => m.id === msgId ? { ...m, isTyping: false } : m)
        );
        setIsTyping(false);
        if (rawFeedback) {
            executeAICommand(rawFeedback);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-80 md:w-96 z-[101] bg-dark-900/90 backdrop-blur-xl border-l border-neon-blue/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col font-mono"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-neon-blue/20 bg-dark-800/50">
                            <div className="flex items-center gap-2 text-neon-blue">
                                <Cpu className="w-5 h-5 animate-pulse" />
                                <span className="text-sm tracking-widest uppercase font-bold text-shadow-glow">Cyber-Terminal</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-neon-pink transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-lg text-xs leading-relaxed ${msg.role === 'user'
                                            ? 'bg-neon-blue/20 text-blue-100 border border-neon-blue/30 rounded-tr-none'
                                            : 'bg-dark-800 border border-dark-600 text-gray-300 rounded-tl-none relative before:absolute before:top-0 before:-left-2 before:w-2 before:h-2 before:bg-dark-600 before:[clip-path:polygon(100%_0,0_0,100%_100%)]'
                                            }`}
                                    >
                                        {msg.role === 'ai' && msg.isTyping ? (
                                            <TypewriterText
                                                text={msg.text}
                                                onComplete={() => handleTypingComplete(msg.id, msg.raw)}
                                            />
                                        ) : (
                                            <span>{msg.text}</span>
                                        )}
                                        {msg.role === 'ai' && !msg.isTyping && (
                                            <div className="mt-1 flex gap-1 items-center opacity-50">
                                                <div className="w-1 h-1 rounded-full bg-neon-blue" />
                                                <span className="text-[8px] uppercase tracking-wider">Overseer Data Output</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isTyping && messages[messages.length - 1]?.role !== 'ai' && (
                                <div className="flex justify-start">
                                    <div className="p-3 bg-dark-800 border border-dark-600 rounded-lg rounded-tl-none">
                                        <div className="flex gap-1.5 items-center h-4">
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                                            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-neon-blue" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-neon-blue/20 bg-dark-800/80">
                            <form onSubmit={handleSendMessage} className="relative flex items-center">
                                <Terminal className="absolute left-3 w-4 h-4 text-neon-blue" />
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    disabled={isTyping}
                                    placeholder={isTyping ? "Overseer is calculating..." : "Enter command query..."}
                                    className="w-full bg-dark-900 border border-dark-600 focus:border-neon-blue rounded-lg py-2.5 pl-10 pr-12 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all disabled:opacity-50"
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isTyping}
                                    className="absolute right-2 p-1.5 text-gray-500 hover:text-neon-blue disabled:hover:text-gray-500 transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AITerminal;
