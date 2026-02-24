import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search as SearchIcon, ArrowRight, Clock, Trash2, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import products from '../data/products.json';

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [ghostText, setGhostText] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Load recent searches on mount
    useEffect(() => {
        try {
            const history = localStorage.getItem('chor_bazaar_history');
            if (history) {
                setRecentSearches(JSON.parse(history));
            }
        } catch (e) {
            console.error("Failed to load search history", e);
        }
    }, [isOpen]);

    // Save a search query to history
    const saveSearchToHistory = (searchQuery) => {
        if (!searchQuery.trim()) return;

        const term = searchQuery.trim().toLowerCase();
        setRecentSearches(prev => {
            // Remove if already exists to move to top
            const filtered = prev.filter(q => q.toLowerCase() !== term);
            const updated = [searchQuery.trim(), ...filtered].slice(0, 5); // Keep last 5
            localStorage.setItem('chor_bazaar_history', JSON.stringify(updated));
            return updated;
        });
    };

    const removeSearch = (e, termToRemove) => {
        e.stopPropagation();
        setRecentSearches(prev => {
            const updated = prev.filter(q => q !== termToRemove);
            localStorage.setItem('chor_bazaar_history', JSON.stringify(updated));
            return updated;
        });
    };

    const purgeCache = () => {
        setRecentSearches([]);
        localStorage.removeItem('chor_bazaar_history');
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Tab' && ghostText) {
            e.preventDefault(); // Prevent focus shift
            setQuery(query + ghostText);
            return;
        }

        if (e.key === 'Enter' && query.trim()) {
            saveSearchToHistory(query);
            // Optionally navigate to a full search results page here if we had one
            // navigate(`/products?search=${encodeURIComponent(query)}`);
            // onClose();
        }
    };

    const handleResultClick = (product) => {
        saveSearchToHistory(query);
        onClose();
    };

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setGhostText('');
            return;
        }

        // Ghost text matching logic
        const match = recentSearches.find(term =>
            term.toLowerCase().startsWith(query.toLowerCase()) &&
            term.length > query.length
        );

        if (match) {
            // Cut off the part that the user has already typed, whatever case it is
            setGhostText(match.slice(query.length));
        } else {
            setGhostText('');
        }

        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
    }, [query]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-dark-900/95 backdrop-blur-xl"
                >
                    <div className="w-full max-w-3xl relative">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute -top-12 right-0 text-gray-500 hover:text-neon-pink transition-colors p-2"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <motion.div
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-dark-800 border border-neon-blue/30 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.1)]"
                        >
                            {/* Search Input Area */}
                            <div className="flex items-center p-4 border-b border-dark-600 bg-dark-900/50 relative overflow-hidden">
                                <SearchIcon className="w-6 h-6 text-neon-blue ml-2 mr-4 relative z-10" />

                                <div className="relative w-full flex items-center">
                                    {/* The visual ghost text behind the real input */}
                                    <div className="absolute inset-x-0 inset-y-0 flex items-center pointer-events-none whitespace-pre">
                                        <span className="text-transparent font-light text-xl md:text-2xl opacity-0">{query}</span>
                                        <span className="text-dark-400 font-light text-xl md:text-2xl">{ghostText}</span>
                                    </div>

                                    {/* The interactive input */}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        autoFocus
                                        placeholder="Search the archive (e.g., 'Jacket', 'Neon')..."
                                        className="w-full bg-transparent text-white text-xl md:text-2xl placeholder-gray-600 focus:outline-none font-light relative z-10"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleSearchSubmit}
                                    />
                                </div>
                            </div>

                            {/* Results Area */}
                            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
                                {query.trim() === '' ? (
                                    recentSearches.length > 0 ? (
                                        <div className="py-4 px-2">
                                            <div className="flex justify-between items-center mb-3 px-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock size={14} /> Data Cache (Recent)
                                                </span>
                                                <button
                                                    onClick={purgeCache}
                                                    className="text-xs font-bold text-neon-pink/70 hover:text-neon-pink uppercase tracking-widest border border-neon-pink/20 hover:border-neon-pink/50 rounded px-2 py-1 transition-all"
                                                >
                                                    Purge Cache
                                                </button>
                                            </div>
                                            <div className="space-y-1 relative">
                                                {/* Scanline Background Effect */}
                                                <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
                                                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px)' }}>
                                                </div>

                                                <AnimatePresence>
                                                    {recentSearches.map((term, index) => (
                                                        <motion.div
                                                            key={term}
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                                                            transition={{ duration: 0.2, delay: index * 0.05 }}
                                                            onClick={() => {
                                                                setQuery(term);
                                                                if (inputRef.current) inputRef.current.focus();
                                                            }}
                                                            className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-700/50 cursor-pointer group transition-colors relative z-10"
                                                        >
                                                            <span className="text-gray-300 font-mono text-sm group-hover:text-neon-blue transition-colors">
                                                                &gt; {term}
                                                            </span>
                                                            <button
                                                                onClick={(e) => removeSearch(e, term)}
                                                                className="text-gray-600 hover:text-neon-pink p-1 rounded-md hover:bg-dark-600 transition-colors"
                                                                title="Clear from cache"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </motion.div>
                                                    ))}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="py-4 px-2">
                                            <div className="flex items-center mb-4 px-2">
                                                <TrendingUp size={14} className="text-neon-blue mr-2" />
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                    Trending Sector Data
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50 border border-dark-600/50 cursor-pointer hover:border-neon-pink group transition-colors" onClick={() => { setQuery('Jacket'); if (inputRef.current) inputRef.current.focus(); }}>
                                                    <span className="text-gray-300 font-mono text-sm group-hover:text-neon-pink transition-colors">
                                                        &gt; PHANTOM_JACKET
                                                    </span>
                                                    <span className="text-neon-pink text-[10px] font-bold tracking-widest bg-neon-pink/10 px-2 py-1 rounded">
                                                        [+14%]
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50 border border-dark-600/50 cursor-pointer hover:border-neon-blue group transition-colors" onClick={() => { setQuery('Boots'); if (inputRef.current) inputRef.current.focus(); }}>
                                                    <span className="text-gray-300 font-mono text-sm group-hover:text-neon-blue transition-colors">
                                                        &gt; GRAVITY_BOOTS
                                                    </span>
                                                    <span className="text-neon-blue text-[10px] font-bold tracking-widest bg-neon-blue/10 px-2 py-1 rounded">
                                                        [LOW_STOCK]
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between p-3 rounded-lg bg-dark-800/50 border border-dark-600/50 cursor-pointer hover:border-neon-green group transition-colors" onClick={() => { setQuery('Tech'); if (inputRef.current) inputRef.current.focus(); }}>
                                                    <span className="text-gray-300 font-mono text-sm group-hover:text-neon-green transition-colors">
                                                        &gt; NEON_ACCESSORIES
                                                    </span>
                                                    <span className="text-neon-green text-[10px] font-bold tracking-widest bg-neon-green/10 px-2 py-1 rounded">
                                                        [NEW_DROP]
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                ) : results.length > 0 ? (
                                    <div className="flex flex-col gap-2">
                                        <div className="px-4 py-2 text-xs font-bold text-neon-pink uppercase tracking-widest">
                                            Found {results.length} Matches
                                        </div>
                                        {results.map((product) => (
                                            <Link
                                                key={product.id}
                                                to={`/product/${product.id}`}
                                                onClick={() => handleResultClick(product)}
                                                className="flex items-center gap-4 p-4 rounded-xl hover:bg-dark-700/50 group transition-colors"
                                            >
                                                <div className="w-16 h-16 bg-dark-900 rounded-lg overflow-hidden border border-dark-600 flex-shrink-0">
                                                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold text-lg group-hover:text-neon-blue transition-colors line-clamp-1">{product.title}</h4>
                                                    <span className="text-gray-500 text-xs uppercase tracking-wider">{product.category}</span>
                                                </div>
                                                <div className="text-white font-medium mr-4">
                                                    ${product.price.toFixed(2)}
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-neon-blue transform group-hover:translate-x-1 transition-all" />
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 text-center text-red-400 font-mono text-sm uppercase tracking-widest">
                                        No entries found in archive for "{query}".
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
