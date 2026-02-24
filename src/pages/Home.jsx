import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe, Plane } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import GlobalPulseMap from '../components/GlobalPulseMap';
import SystemLoader from '../components/SystemLoader';
import { db } from '../utils/stitch';
import useDecrypt from '../hooks/useDecrypt';

const pageVariants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.1,
            staggerChildren: 0.15
        }
    }
};

const heroImageVariants = {
    hidden: { opacity: 0, filter: 'blur(30px)', scale: 1 },
    visible: {
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1.15,
        transition: {
            opacity: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
            filter: { duration: 1.2, ease: [0.25, 1, 0.5, 1] },
            scale: { duration: 25, repeat: Infinity, repeatType: "reverse", ease: "linear" }
        }
    }
};

const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] }
    }
};

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Decrypt hook for headings
    const heroTitle = useDecrypt("CHOR BAZZAR", 200, 1200);
    const newArrivalsTitle = useDecrypt("NEW ARRIVALS", 500, 1000);
    const networkTelemetryTitle = useDecrypt("NETWORK TELEMETRY", 800, 1000);

    useEffect(() => {
        const fetchFeatured = async () => {
            setIsLoading(true);
            try {
                // Fetching top 4 products from MongoDB via our simulated Stitch backend
                const data = await db.collection("products").find({}, { limit: 4 }).toArray();
                setFeaturedProducts(data);
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    return (
        <motion.div className="origin-center" initial="hidden" animate="visible" variants={pageVariants}>
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-dark-900/80 z-10"></div>
                    <motion.img
                        src="https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=2000"
                        alt="Cyberpunk Streetwear"
                        className="w-full h-full object-cover object-center animate-[pulse_8s_ease-in-out_infinite]"
                        variants={heroImageVariants}
                    />
                </div>

                {/* Empty div to push content to middle */}
                <div className="flex-1"></div>

                {/* Center Content */}
                <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex-1 flex flex-col justify-center">
                    <motion.div variants={textVariants} className="inline-block mb-6 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 backdrop-blur-md pb-1 self-center">
                        <span className="text-neon-blue text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                            <Zap size={16} className="fill-neon-blue" /> System Reboot V2.0 Live
                        </span>
                    </motion.div>
                    <motion.h1 variants={textVariants} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 tracking-tighter uppercase leading-[0.9]">
                        <span className="inline-block">The</span>{" "}
                        <span className="inline-block">Future</span> <br />
                        <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink neon-text-glow mt-2">
                            {heroTitle}
                        </span>
                    </motion.h1>
                    <motion.p variants={textVariants} className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
                        Premium techwear and urban apparel designed for the digital native. Upgrade your chassis.
                    </motion.p>
                    <motion.div variants={textVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/products" className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center">
                            ACCESS ARCHIVE <ArrowRight size={20} />
                        </Link>
                        <Link to="/products?category=Accessories" className="btn-secondary w-full sm:w-auto text-center">
                            VIEW HARDWARE
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Features Banner */}
            <section className="border-y border-dark-700 bg-dark-800/50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-dark-700">
                        {/* Shield - Encrypted Checkout */}
                        <motion.div
                            className="flex flex-col items-center p-6 relative overflow-hidden rounded-2xl transition-colors hover:bg-dark-700/50 cursor-pointer"
                            whileHover="hover"
                        >
                            <motion.div variants={{ hover: { scale: 1.2, rotate: [0, -10, 10, -10, 0] } }} transition={{ duration: 0.5 }}>
                                <Shield className="w-10 h-10 text-neon-green mb-4" />
                            </motion.div>
                            <h3 className="text-white font-bold text-xl mb-2 relative z-10">Encrypted Checkout</h3>
                            <p className="text-gray-400 text-sm relative z-10">Military-grade transaction security.</p>
                        </motion.div>

                        {/* Zap - Hyper-Fast Shipping with Drone Zoom */}
                        <motion.div
                            className="flex flex-col items-center p-6 relative overflow-hidden rounded-2xl transition-colors hover:bg-dark-700/50 cursor-pointer"
                            whileHover="hover"
                        >
                            <motion.div variants={{ hover: { scale: 1.2, color: "#fff" } }} transition={{ duration: 0.3 }} className="relative z-10">
                                <Zap className="w-10 h-10 text-neon-blue mb-4" />
                            </motion.div>

                            {/* Drone Zoom Animation */}
                            <motion.div
                                className="absolute top-10 text-neon-blue/20 pointer-events-none"
                                variants={{ hover: { x: ["-150%", "150%"], opacity: [0, 1, 0] } }}
                                transition={{ duration: 0.7, ease: "easeInOut" }}
                                initial={{ x: "-150%", opacity: 0 }}
                            >
                                <Plane className="w-16 h-16 transform right-4" />
                            </motion.div>

                            <h3 className="text-white font-bold text-xl mb-2 relative z-10">Hyper-Fast Shipping</h3>
                            <p className="text-gray-400 text-sm relative z-10">Next-day drone delivery in select zones.</p>
                        </motion.div>

                        {/* Globe - Global Syndicate */}
                        <motion.div
                            className="flex flex-col items-center p-6 relative overflow-hidden rounded-2xl transition-colors hover:bg-dark-700/50 cursor-pointer"
                            whileHover="hover"
                        >
                            <motion.div variants={{ hover: { rotate: 180, scale: 1.2 } }} transition={{ duration: 0.6 }}>
                                <Globe className="w-10 h-10 text-neon-pink mb-4" />
                            </motion.div>
                            <h3 className="text-white font-bold text-xl mb-2 relative z-10">Global Syndicate</h3>
                            <p className="text-gray-400 text-sm relative z-10">Worldwide shipping to 150+ territories.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white uppercase tracking-tight">{newArrivalsTitle}</h2>
                        <div className="h-1 w-20 bg-neon-pink mt-4 rounded-full"></div>
                    </div>
                    <Link to="/products" className="hidden md:flex items-center gap-2 text-neon-blue hover:text-white transition-colors font-bold uppercase tracking-wider text-sm border-b border-transparent hover:border-neon-blue pb-1">
                        View All Data <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 auto-rows-[400px] md:auto-rows-auto h-auto md:h-[800px]">
                    {isLoading ? (
                        <div className="col-span-1 md:col-span-4 md:row-span-2">
                            <SystemLoader fullScreen={false} text="FETCHING ARCHIVES..." />
                        </div>
                    ) : featuredProducts.length >= 4 ? (
                        <>
                            {/* The Hero Product - Takes up 2x2 space */}
                            <div className="md:col-span-2 md:row-span-2 border border-neon-blue/50 rounded-3xl overflow-hidden relative transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]">
                                <ProductCard product={featuredProducts[0]} isLarge={true} />
                            </div>

                            {/* Secondary Products */}
                            <div className="md:col-span-2 md:row-span-1 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/30">
                                <ProductCard product={featuredProducts[1]} isHorizontal={true} />
                            </div>

                            <div className="md:col-span-1 md:row-span-1 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300 hover:border-white/30">
                                <ProductCard product={featuredProducts[2]} />
                            </div>

                            <div className="md:col-span-1 md:row-span-1 border border-neon-purple/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,0,255,0.15)]">
                                <ProductCard product={featuredProducts[3]} />
                            </div>
                        </>
                    ) : null}
                </div>

                <div className="mt-12 md:hidden text-center">
                    <Link to="/products" className="btn-secondary w-full inline-block">
                        View All Data
                    </Link>
                </div>
            </section>

            {/* Promo Section */}
            <section className="my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative rounded-3xl overflow-hidden bg-dark-800 border border-dark-600 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/80 to-transparent z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=2000"
                        alt="Neon Tokyo"
                        className="absolute inset-0 w-full h-full object-cover object-right opacity-60 mix-blend-luminosity"
                    />
                    <div className="relative z-20 p-8 md:p-16 w-full lg:w-1/2">
                        <span className="text-neon-green font-bold tracking-widest uppercase mb-2 block">Limited Time Event</span>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 uppercase leading-tight">
                            Midnight Run <br /><span className="text-neon-blue">Collection</span>
                        </h2>
                        <p className="text-gray-300 mb-8 max-w-md">
                            High-visibility gear designed for the night shift. Reflective materials meet tactical utility.
                        </p>
                        <Link to="/products?category=Jackets" className="btn-primary inline-flex">
                            Explore Collection
                        </Link>
                    </div>
                </div>
            </section>

            {/* Global Pulse Tracker */}
            <section id="telemetry-section" className="my-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-display font-bold text-white uppercase tracking-tight">{networkTelemetryTitle}</h2>
                        <div className="h-1 w-16 bg-neon-blue mt-4 rounded-full"></div>
                    </div>
                </div>
                <GlobalPulseMap />
            </section>
        </motion.div>
    );
};

export default Home;
