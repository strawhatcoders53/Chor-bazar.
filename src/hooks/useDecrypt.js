import { useState, useEffect } from 'react';

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-='

export const useDecrypt = (originalText, startDelay = 0, duration = 1000) => {
    const [displayText, setDisplayText] = useState('');
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        let timeoutId;

        const startDecryption = () => {
            setIsStarted(true);

            let currentIteration = 0;
            const textLength = originalText.length;
            // Calculate how many times interval should fire based on duration
            // Let's fire every 30ms for a smooth scramble
            const intervalTime = 30;
            const totalIterations = Math.floor(duration / intervalTime);

            // At what iteration should each character be solved
            const maxIterations = textLength + totalIterations / 3;

            const interval = setInterval(() => {
                setDisplayText(
                    originalText
                        .split('')
                        .map((char, index) => {
                            // If character is a space, keep it a space
                            if (char === ' ') return ' ';

                            // If we've passed the threshold for this letter, show actual letter
                            if (currentIteration >= (index / textLength) * maxIterations) {
                                return char;
                            }

                            // Otherwise, show random sci-fi character
                            return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                        })
                        .join('')
                );

                if (currentIteration >= maxIterations) {
                    clearInterval(interval);
                    setDisplayText(originalText);
                }

                currentIteration += 1;
            }, intervalTime);

            return () => clearInterval(interval);
        };

        if (startDelay > 0) {
            timeoutId = setTimeout(startDecryption, startDelay);
        } else {
            startDecryption();
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [originalText, startDelay, duration]);

    // Return completely scrambled initially if not started yet
    if (!isStarted && originalText) {
        return originalText.split('').map(c => c === ' ' ? ' ' : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]).join('');
    }

    return displayText;
};

export default useDecrypt;
