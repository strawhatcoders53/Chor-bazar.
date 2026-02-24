import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Truck, Shield, ArrowLeft, CheckCircle2, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import productsData from '../data/products.json';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import ReviewSection from '../components/ReviewSection';
import SystemLoader from '../components/SystemLoader';
import { QRCodeSVG } from 'qrcode.react';
import { createHum } from '../utils/audioSynth';
import { useLenis } from '@studio-freight/react-lenis';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const lenis = useLenis();

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState('L');
    const [isAdding, setIsAdding] = useState(false);
    const [isARModalOpen, setIsARModalOpen] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        // Simulate API fetch delay
        const timer = setTimeout(() => {
            const foundProduct = productsData.find(p => p.id === id);
            setProduct(foundProduct);
            setIsLoading(false);
            window.scrollTo(0, 0);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    // Low Frequency Hum for AR Viewer using native WebAudio API
    useEffect(() => {
        const hum = createHum();
        if (isARModalOpen) {
            hum.start();
        }
        return () => {
            hum.stop();
        };
    }, [isARModalOpen]);

    const handleAddToCart = () => {
        setIsAdding(true);
        addToCart(product, quantity);
        setTimeout(() => {
            setIsAdding(false);
        }, 600);
    };

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32">
                <SystemLoader fullScreen={false} text="DECRYPTING ASSET DATA..." />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <h2 className="text-4xl font-display font-bold text-white mb-4">DATA NOT FOUND</h2>
                <p className="text-gray-400 mb-8">The item you are looking for does not exist in this database.</p>
                <Link to="/products" className="btn-primary inline-flex">Return to Shop</Link>
            </div>
        );
    }

    // Related products logic
    const relatedProducts = productsData
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium text-sm mb-8 uppercase tracking-widest">
                <ArrowLeft size={16} /> Back
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                {/* Images */}
                <div className="space-y-4">
                    <div className="relative aspect-[4/5] bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 shadow-xl group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-dark-900/60 to-transparent z-10 pointer-events-none"></div>
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                        />
                        {product.stock < 10 && (
                            <div className="absolute top-4 right-4 z-20 bg-neon-pink text-white text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wider shadow-[0_0_10px_rgba(255,0,60,0.5)]">
                                Only {product.stock} Left
                            </div>
                        )}
                    </div>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                    <div className="mb-2">
                        <span className="text-neon-blue text-xs font-bold uppercase tracking-widest bg-neon-blue/10 px-3 py-1 rounded-full border border-neon-blue/20">
                            {product.category}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
                        {product.title}
                    </h1>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-3xl font-bold text-white">${product.price.toFixed(2)}</div>
                        <div className="h-6 w-px bg-dark-700"></div>
                        <div className="flex items-center gap-1.5 bg-dark-800 px-3 py-1 rounded-full border border-dark-600 cursor-pointer hover:border-neon-green transition-colors">
                            <Star className="w-4 h-4 text-neon-green fill-neon-green" />
                            <span className="text-white font-medium text-sm">{product.rating}</span>
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                if (lenis) {
                                    lenis.scrollTo('#reviews-section', { offset: -100 });
                                } else {
                                    const element = document.getElementById('reviews-section');
                                    if (element) {
                                        element.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }
                            }}
                            className="text-gray-500 text-sm decoration-dark-600 cursor-pointer hover:text-gray-300 flex items-center gap-2 group"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-green shadow-[0_0_8px_rgba(0,255,128,0.8)] animate-pulse shrink-0 group-hover:bg-white group-hover:shadow-[0_0_12px_rgba(255,255,255,0.8)] transition-all"></span>
                            <span>READ REVIEWS</span>
                        </button>
                    </div>

                    <p className="text-gray-300 text-lg leading-relaxed font-light mb-8">
                        {product.description}
                    </p>

                    <div className="h-px w-full bg-dark-700 mb-8"></div>

                    {/* Size Selector */}
                    <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div className="flex-grow w-full">
                            <div className="flex justify-between items-end mb-3">
                                <h3 className="text-white font-semibold uppercase text-sm tracking-wider">Select Chassis Size</h3>
                                <button className="text-neon-pink text-xs uppercase tracking-wider font-bold hover:underline">Size Guide</button>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                                {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`py-3 rounded-lg font-bold text-sm transition-all duration-200 ${selectedSize === size
                                            ? 'bg-white text-dark-900 shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                            : 'bg-dark-800 text-gray-300 border border-dark-600 hover:border-white'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setIsARModalOpen(true)}
                            className="flex items-center gap-2 justify-center py-3 px-6 rounded-lg font-bold text-sm uppercase tracking-wider bg-dark-800 text-neon-blue border border-neon-blue/50 hover:bg-neon-blue hover:text-dark-900 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 w-full sm:w-auto h-[48px]"
                        >
                            <Box size={18} /> AR View
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex items-center justify-between bg-dark-800 border border-dark-600 rounded-xl px-4 py-2 sm:w-32">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="text-gray-400 hover:text-white pb-1 text-xl"
                            >-</button>
                            <span className="text-white font-bold">{quantity}</span>
                            <button
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                className="text-gray-400 hover:text-white pb-1 text-xl"
                            >+</button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdding || product.stock === 0}
                            className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 font-bold uppercase tracking-wider ${isAdding
                                ? 'bg-neon-green text-dark-900'
                                : product.stock === 0
                                    ? 'bg-dark-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-neon-blue text-dark-900 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-[0.98]'
                                }`}
                        >
                            {isAdding ? (
                                <><CheckCircle2 className="w-5 h-5" /> Acquired</>
                            ) : (
                                <><ShoppingCart className="w-5 h-5" /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cargo'}</>
                            )}
                        </button>
                    </div>

                    {/* Guarantees */}
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Truck className="w-5 h-5 text-neon-blue" />
                            <span>Free global deploy on orders over $150</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Shield className="w-5 h-5 text-neon-pink" />
                            <span>30-day money-back protocol</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Social Proof: Comms Logs */}
            <ReviewSection productId={product.id} />

            {/* Related Data */}
            {relatedProducts.length > 0 && (
                <section className="border-t border-dark-800 pt-16">
                    <h2 className="text-2xl font-display font-bold text-white mb-8 uppercase tracking-widest border-l-4 border-neon-blue pl-4">
                        Correlated Data
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map(related => (
                            <ProductCard key={related.id} product={related} />
                        ))}
                    </div>
                </section>
            )}

            {/* AR View Modal */}
            {isARModalOpen && (
                <Modal
                    isOpen={isARModalOpen}
                    onClose={() => setIsARModalOpen(false)}
                    title="Augmented Reality Setup"
                >
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border-4 border-dark-600 relative group">
                            <div className="absolute inset-0 border-2 border-neon-blue rounded-lg opacity-0 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none"></div>
                            <QRCodeSVG
                                value={`https://chor-bazzar-ar-demo.vercel.app/view/${product.id}`}
                                size={200}
                                bgColor="#ffffff"
                                fgColor="#0a0a0a"
                                level="H"
                                includeMargin={false}
                            />
                        </div >

                        <h4 className="text-white font-bold text-lg mb-2">Scan with your Optic Sensor</h4>
                        <p className="text-gray-400 text-sm mb-6 max-w-sm">
                            Point your smartphone camera at this code to project the <strong className="text-neon-pink">{product.title}</strong> directly into your physical space.
                        </p>

                        <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest">
                            <CheckCircle2 size={14} className="text-neon-green" />
                            Requires iOS 12+ or Android 8.0+
                        </div>
                    </div >
                </Modal >
            )}

        </div >
    );
};

export default ProductDetail;
