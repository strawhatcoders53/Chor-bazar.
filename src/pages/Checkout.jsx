import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import BiometricButton from '../components/BiometricButton';
import DeliveryTracker from '../components/DeliveryTracker';

const Checkout = () => {
    const navigate = useNavigate();
    const {
        cartItems, cartTotal, cartSubtotal, clearCart,
        promoCode, discountAmount, applyPromoCode, removePromoCode
    } = useCart();

    const [promoInput, setPromoInput] = useState('');

    const [isProcessing, setIsProcessing] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expDate: '',
        cvv: ''
    });

    // Handle scroll and overflow resets when order is completed
    React.useEffect(() => {
        if (orderComplete) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.style.overflow = 'auto';
            document.body.style.touchAction = 'auto';
            document.documentElement.style.overflow = 'auto'; // Extra safety
        }
        return () => {
            // Cleanup on unmount
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.documentElement.style.overflow = '';
        };
    }, [orderComplete]);

    const SHIPPING_COST = cartTotal > 150 ? 0 : 15;
    const taxes = cartTotal * 0.08;
    const finalTotal = cartTotal + SHIPPING_COST + taxes;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckoutSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setOrderComplete(true);
            clearCart();
        }, 2000);
    };

    if (cartItems.length === 0 && !orderComplete) {
        navigate('/cart');
        return null;
    }

    if (orderComplete) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center min-h-screen flex flex-col items-center justify-start relative z-[100] bg-dark-950">
                <div className="bg-neon-green/20 p-6 rounded-full border border-neon-green/50 mb-8 animate-[glow_2s_ease-in-out_infinite_alternate]">
                    <CheckCircle2 className="w-20 h-20 text-neon-green" />
                </div>
                <h2 className="text-5xl font-display font-bold text-white mb-4 uppercase tracking-wider">
                    Transaction <span className="text-neon-green">Verified</span>
                </h2>
                <p className="text-gray-300 mb-2 max-w-md mx-auto text-lg">
                    Your digital funds have been received.
                </p>
                <p className="text-gray-500 mb-6 font-mono text-sm">
                    RECEIPT ID: #{Math.random().toString(36).substring(2, 10).toUpperCase()}
                </p>

                <div className="w-full max-w-2xl mb-8">
                    <DeliveryTracker />
                </div>

                <button
                    onClick={() => navigate('/')}
                    className="btn-primary relative z-20"
                >
                    Return to Hub
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-display font-bold text-white uppercase tracking-tight mb-8 hidden md:block border-b border-dark-700 pb-4">
                Secure Handshake
            </h1>

            <div className="flex flex-col lg:flex-row gap-12 lg:flex-row-reverse">

                {/* Order Summary Sidebar */}
                <div className="lg:w-1/3">
                    <div className="bg-dark-800 border border-dark-600 rounded-2xl p-6 lg:sticky lg:top-28">
                        <h2 className="text-xl font-bold text-white mb-6 uppercase tracking-wider font-display">
                            Cart Contents
                        </h2>

                        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-dark-700 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="text-white text-sm font-semibold line-clamp-1">{item.title}</h4>
                                        <span className="text-gray-500 text-xs">Qty: {item.quantity}</span>
                                    </div>
                                    <div className="text-white font-medium text-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="h-px bg-dark-600 mb-4"></div>

                        <div className="space-y-3 mb-6 text-sm font-mono">
                            <div className="flex justify-between text-gray-400">
                                <span>Subtotal</span>
                                <span>${cartSubtotal.toFixed(2)}</span>
                            </div>
                            {promoCode && (
                                <div className="flex justify-between text-neon-green">
                                    <span>Discount ({promoCode})</span>
                                    <span>-${discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-gray-400">
                                <span>Routing Fee</span>
                                <span>{SHIPPING_COST === 0 ? <span className="text-neon-blue">FREE</span> : `$${SHIPPING_COST.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between text-gray-400">
                                <span>Local Tax (8%)</span>
                                <span>${taxes.toFixed(2)}</span>
                            </div>
                        </div>

                        {!promoCode ? (
                            <div className="flex gap-2 mb-6">
                                <input
                                    type="text"
                                    value={promoInput}
                                    onChange={(e) => setPromoInput(e.target.value)}
                                    placeholder="AUTHORIZATION CODE"
                                    className="bg-dark-900 border-dark-600 text-white placeholder-gray-500 rounded-lg px-3 py-2 text-sm uppercase tracking-wider focus:outline-none focus:border-neon-pink flex-grow border font-mono"
                                />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const res = applyPromoCode(promoInput);
                                        if (res.success) setPromoInput('');
                                    }}
                                    className="bg-dark-700 hover:bg-neon-pink hover:text-white text-gray-300 px-4 rounded-lg text-xs font-bold uppercase transition-colors whitespace-nowrap"
                                >
                                    Apply
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center bg-neon-green/10 border border-neon-green/30 p-3 rounded-lg mb-6">
                                <div className="flex flex-col">
                                    <span className="text-neon-green text-xs font-bold tracking-widest uppercase">Active Override</span>
                                    <span className="text-white font-mono text-sm">{promoCode}</span>
                                </div>
                                <button type="button" onClick={removePromoCode} className="text-gray-400 hover:text-neon-pink text-xs underline decoration-dark-600 underline-offset-4 tracking-wider uppercase">Remove</button>
                            </div>
                        )}

                        <div className="h-px bg-dark-600 mb-4"></div>

                        <div className="flex justify-between text-white font-bold text-xl mb-2">
                            <span>Total Authorization</span>
                            <span className="text-neon-pink">${finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="lg:w-2/3">
                    <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-10">

                        {/* Contact Info */}
                        <div className="bg-dark-800/50 p-6 md:p-8 rounded-2xl border border-dark-700">
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <span className="bg-neon-blue text-dark-900 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                                Contact Authorization
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Email Node</label>
                                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="input-field" placeholder="identifier@network.com" />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="bg-dark-800/50 p-6 md:p-8 rounded-2xl border border-dark-700">
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <span className="bg-neon-pink text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                                Drop Coordinates
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">First Matrix Name</label>
                                    <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="input-field" placeholder="Neo" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Last Matrix Name</label>
                                    <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="input-field" placeholder="Anderson" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Sector Address</label>
                                    <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="input-field" placeholder="123 Datastream Ave, Apt 4" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">City Array</label>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="input-field" placeholder="Neo-Tokyo" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Zip Code</label>
                                    <input required name="zipCode" value={formData.zipCode} onChange={handleInputChange} type="text" className="input-field" placeholder="10001" />
                                </div>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-dark-800/50 p-6 md:p-8 rounded-2xl border border-dark-700">
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                                <span className="bg-neon-green text-dark-900 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                                Credit Allocation
                            </h3>

                            <div className="bg-dark-900/50 p-4 border border-dark-600 rounded-lg mb-6 flex items-start gap-4">
                                <ShieldAlert className="w-5 h-5 text-neon-green mt-0.5" />
                                <p className="text-gray-400 text-sm">
                                    This connection is encrypted. Do not enter real credit card details. This is a simulation environment.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Card Sequence</label>
                                    <input required name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} type="text" className="input-field font-mono" placeholder="0000 0000 0000 0000" maxLength="19" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Expiration Date</label>
                                    <input required name="expDate" value={formData.expDate} onChange={handleInputChange} type="text" className="input-field font-mono" placeholder="MM/YY" maxLength="5" />
                                </div>
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">CVV Code</label>
                                    <input required name="cvv" value={formData.cvv} onChange={handleInputChange} type="text" className="input-field font-mono" placeholder="123" maxLength="4" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="hidden">Submit</button>
                        <BiometricButton
                            isProcessing={isProcessing}
                            amount={finalTotal}
                            onStart={() => {
                                const form = document.getElementById('checkout-form');
                                if (form) {
                                    return form.reportValidity();
                                }
                                return true;
                            }}
                            onSuccess={() => {
                                const form = document.getElementById('checkout-form');
                                if (form) {
                                    const event = new Event('submit', { cancelable: true, bubbles: true });
                                    form.dispatchEvent(event);
                                }
                            }}
                        />

                    </form>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
