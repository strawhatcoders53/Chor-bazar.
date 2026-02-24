import { useCallback } from 'react';

const useScreenShake = () => {
    const triggerShake = useCallback(() => {
        const rootElement = document.getElementById('root');

        if (!rootElement) return;

        // Apply a random fast translation and rotation to simulate a heavy mechanical clunk
        const xTranslate = (Math.random() - 0.5) * 8; // -4px to 4px
        const yTranslate = (Math.random() - 0.5) * 8; // -4px to 4px

        rootElement.style.transition = 'transform 50ms cubic-bezier(0.25, 1.5, 0.5, 1)';
        rootElement.style.transform = `translate(${xTranslate}px, ${yTranslate}px) scale(1.005)`;

        setTimeout(() => {
            // Snap back aggressively
            rootElement.style.transition = 'transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            rootElement.style.transform = 'translate(0px, 0px) scale(1)';

            // Cleanup transition property after animation completes
            setTimeout(() => {
                rootElement.style.transition = '';
            }, 150);
        }, 50);

    }, []);

    return triggerShake;
};

export default useScreenShake;
