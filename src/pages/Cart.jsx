import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingBag, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

    const SHIPPING_COST = cartTotal > 150 ? 0 : 15;
    const TAX_RATE = 0.08;
    const taxes = cartTotal * TAX_RATE;
    const finalTotal = cartTotal + SHIPPING_COST + taxes;

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-32 text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-dark-800 p-6 rounded-full border border-dark-600">
                        <ShoppingBag className="w-16 h-16 text-gray-400" />
                    </div>
                </div>
                <h2 className="text-4xl font-display font-bold text-white mb-4">CARGO EMPTY</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    Your digital inventory is currently empty. Browse the archives to acquire new gear.
                </p>
                <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                    Initialize Shopping <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-display font-bold text-white uppercase tracking-tight mb-8 hidden md:block">
                Active Cargo
            </h1>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Cart Items List */}
                <div className="lg:w-2/3 space-y-6">
                    <div className="hidden md:grid grid-cols-12 gap-4 text-gray-500 uppercase text-xs font-bold tracking-wider mb-4 pb-4 border-b border-dark-700">
                        <div className="col-span-6">Item Designation</div>
                        <div className="col-span-3 text-center">Price</div>
                        <div className="col-span-2 text-center">Quantity</div>
                        <div className="col-span-1 text-right">Remove</div>
                    </div>

                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-dark-800 md:bg-transparent border md:border-t-0 border-dark-700 rounded-xl md:rounded-none p-4 md:p-0 md:py-6 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-center md:border-b transition-colors hover:bg-dark-800/50">

                            {/* Product Info */}
                            <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                                <div className="w-24 h-24 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0 border border-dark-600">
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-neon-pink text-xs font-bold uppercase tracking-wider mb-1">
                                        {item.category}
                                    </div>
                                    <Link to={`/product/${item.id}`} className="text-white hover:text-neon-blue font-semibold text-lg line-clamp-2 leading-tight transition-colors">
                                        {item.title}
                                    </Link>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="col-span-1 md:col-span-3 md:text-center text-white font-medium">
                                <span className="md:hidden text-gray-500 text-sm mr-2">Price:</span>
                                ${item.price.toFixed(2)}
                            </div>

                            {/* Quantity */}
                            <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                                <div className="flex items-center justify-between bg-dark-900 border border-dark-600 rounded-lg px-3 py-1.5 w-24">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >-</button>
                                    <span className="text-white text-sm font-bold">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >+</button>
                                </div>
                            </div>

                            {/* Remove */}
                            <div className="col-span-1 md:col-span-1 flex justify-end md:text-right absolute top-4 right-4 md:relative md:top-auto md:right-auto">
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-gray-500 hover:text-neon-pink transition-colors p-2"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/3">
                    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 lg:sticky lg:top-28 shadow-2xl">
                        <h2 className="text-2xl font-display font-bold text-white mb-6 uppercase tracking-wider">
                            Network Totals
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-300">
                                <span>Subtotal</span>
                                <span className="font-medium text-white">${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Routing Fee</span>
                                <span className="font-medium text-white">
                                    {SHIPPING_COST === 0 ? <span className="text-neon-green">FREE</span> : `$${SHIPPING_COST.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-300">
                                <span>Tariffs (8%)</span>
                                <span className="font-medium text-white">${taxes.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="h-px bg-dark-600 mb-6"></div>

                        <div className="flex justify-between text-white font-bold text-xl mb-8">
                            <span>Final Authorization</span>
                            <span className="text-neon-blue">${finalTotal.toFixed(2)}</span>
                        </div>

                        <Link to="/checkout" className="btn-primary w-full flex justify-center py-4 mb-4">
                            PROCEED TO SECURE CHECKOUT
                        </Link>

                        <p className="text-center text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2">
                            <Shield size={14} className="text-neon-green" /> Military Grade Encryption
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;
