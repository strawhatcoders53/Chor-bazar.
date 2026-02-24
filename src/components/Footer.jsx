import { Github, Twitter, Instagram, Disc as Discord } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-dark-900 border-t border-dark-700 pt-16 pb-8 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

                    <div className="space-y-4">
                        <h3 className="text-2xl font-display font-bold text-white tracking-wider">
                            CHOR<span className="text-neon-blue">BAZZAR</span>
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Premium streetwear curated for the digital age. Authenticity guaranteed, from the underground to the overworld.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <a href="#" className="text-gray-400 hover:text-neon-pink transition-colors"><Twitter className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-neon-blue transition-colors"><Instagram className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors"><Discord className="w-5 h-5" /></a>
                            <a href="#" className="text-gray-400 hover:text-neon-green transition-colors"><Github className="w-5 h-5" /></a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wide">SHOP</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Jackets & Outerwear</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Footwear</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Accessories</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wide">SUPPORT</h4>
                        <ul className="space-y-3 text-sm">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping & Returns</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Order</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 tracking-wide">STAY CONNECTED</h4>
                        <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <form className="flex" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-dark-800 border fill border-dark-600 text-white px-4 py-2 rounded-l-lg w-full focus:outline-none focus:border-neon-blue"
                            />
                            <button
                                type="submit"
                                className="bg-neon-blue hover:bg-neon-pink text-dark-900 font-bold px-4 py-2 rounded-r-lg transition-colors duration-300"
                            >
                                JOIN
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} Chor Bazzar. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="text-gray-500 hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
