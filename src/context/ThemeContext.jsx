import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isHacked, setIsHacked] = useState(false);

    const toggleHacked = (val) => setIsHacked(val !== undefined ? val : prev => !prev);

    return (
        <ThemeContext.Provider value={{ isHacked, setIsHacked, toggleHacked }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
