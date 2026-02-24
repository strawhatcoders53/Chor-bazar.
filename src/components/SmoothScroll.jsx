import React from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';

const SmoothScroll = ({ children }) => {
    // Map velocity to CSS variables, applying a "Speed Limit" threshold for glitch fx
    const SPEED_LIMIT = 40; // Only trigger effects if scrolled harder than this

    useLenis(({ velocity }) => {
        const absVel = Math.abs(velocity);

        let warpIntensity = 0;
        let warpOpacity = 0;

        if (absVel > SPEED_LIMIT) {
            // Calculate how far past the limit we've pushed
            // The higher the number, the harder the visual glitch
            const overage = absVel - SPEED_LIMIT;
            // Preserve the direction (sign) of the velocity for realistic tearing
            warpIntensity = Math.sign(velocity) * (overage * 0.8);
            warpOpacity = Math.min((overage / 50), 0.8); // Max out opacity at 0.8
        }

        document.documentElement.style.setProperty('--scroll-velocity', velocity);
        document.documentElement.style.setProperty('--warp-intensity', warpIntensity);
        document.documentElement.style.setProperty('--warp-opacity', warpOpacity);
    });

    const lenisOptions = {
        duration: 1.5,      // How long the "after-effect" lasts
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom "Heavy" easing
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.1, // Makes the scroll feel "powerful"
        touchMultiplier: 2,
        infinite: false,
    };

    return (
        <ReactLenis root options={lenisOptions}>
            {children}
        </ReactLenis>
    );
};

export default SmoothScroll;
