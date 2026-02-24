import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the Context
const WishlistContext = createContext();

// Create a custom hook to use the context easily
export const useWishlist = () => {
    return useContext(WishlistContext);
};

// Create the Provider component
export const WishlistProvider = ({ children }) => {
    // Initialize wishlist state from localStorage, or default to an empty array
    const [wishlist, setWishlist] = useState(() => {
        try {
            const savedWishlist = localStorage.getItem('chorbazzar_wishlist');
            return savedWishlist ? JSON.parse(savedWishlist) : [];
        } catch (error) {
            console.error("Error parsing wishlist from localStorage:", error);
            return [];
        }
    });

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem('chorbazzar_wishlist', JSON.stringify(wishlist));
        } catch (error) {
            console.error("Error saving wishlist to localStorage:", error);
        }
    }, [wishlist]);

    // Function to add or remove an item from the wishlist
    const toggleWishlist = (product) => {
        setWishlist((prevWishlist) => {
            const isAlreadyInWishlist = prevWishlist.some((item) => item.id === product.id);

            if (isAlreadyInWishlist) {
                // Remove the product if it exists
                return prevWishlist.filter((item) => item.id !== product.id);
            } else {
                // Add the product if it doesn't exist
                return [...prevWishlist, product];
            }
        });
    };

    // Derived state: check if a specific item is stashed
    const isInWishlist = (productId) => {
        return wishlist.some((item) => item.id === productId);
    };

    const value = {
        wishlist,
        toggleWishlist,
        isInWishlist,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
