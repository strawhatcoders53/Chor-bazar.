import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const stored = localStorage.getItem('chor_bazzar_cart');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load cart from local storage", e);
            return [];
        }
    });

    const [toastMessage, setToastMessage] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [promoCode, setPromoCode] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);

    useEffect(() => {
        localStorage.setItem('chor_bazzar_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const showToast = useCallback((message) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    }, []);

    const addToCart = useCallback((product, quantity = 1) => {
        setCartItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
        showToast(`Added ${product.title} to cart`);
    }, [showToast]);

    const removeFromCart = useCallback((productId) => {
        setCartItems(prev => prev.filter(item => item.id !== productId));
        showToast('Item removed from cart');
    }, [showToast]);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCartItems(prev =>
            prev.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
        setPromoCode(null);
        setDiscountAmount(0);
    }, []);

    const cartCount = useMemo(() => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    }, [cartItems]);

    // Continuous Gamification Security Validation
    useEffect(() => {
        if (promoCode === 'MACH_SPEED_20' && cartCount > 0 && cartCount < 3) {
            setPromoCode(null);
            setDiscountAmount(0);
            showToast('Velocity Dropped: MACH_SPEED_20 requires 3+ items. Discount removed.');
        }
    }, [cartCount, promoCode, showToast]);

    const applyPromoCode = useCallback((code) => {
        const normalizedCode = code.trim().toUpperCase();

        if (normalizedCode === 'MACH_SPEED_20') {
            if (cartCount >= 3) {
                setPromoCode('MACH_SPEED_20');
                showToast('MAX VELOCITY PROMO APPLIED!');
                return { success: true };
            } else {
                return { success: false, message: 'System Error: Max Velocity (3 items) required to deploy this code.' };
            }
        }

        return { success: false, message: 'Invalid or expired authorization code.' };
    }, [cartCount, showToast]);

    const removePromoCode = useCallback(() => {
        setPromoCode(null);
        setDiscountAmount(0);
        showToast('Promo code removed.');
    }, [showToast]);

    const cartSubtotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    const cartTotal = useMemo(() => {
        let discount = 0;

        if (promoCode === 'MACH_SPEED_20') {
            discount = cartSubtotal * 0.20; // 20% off
        }

        setDiscountAmount(discount);
        return Math.max(0, cartSubtotal - discount);
    }, [cartSubtotal, promoCode]);

    const value = useMemo(() => ({
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartTotal,
        cartCount,
        toastMessage,
        showToast,
        isCartOpen,
        setIsCartOpen,
        promoCode,
        discountAmount,
        applyPromoCode,
        removePromoCode
    }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartSubtotal, cartTotal, cartCount, toastMessage, showToast, isCartOpen, promoCode, discountAmount, applyPromoCode, removePromoCode]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
