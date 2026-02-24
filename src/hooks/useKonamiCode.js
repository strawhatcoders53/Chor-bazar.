import { useState, useEffect } from 'react';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

const useKonamiCode = (callback) => {
    const [input, setInput] = useState([]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            const nextInput = [...input, e.key];

            // Check if the current input matches the code prefix
            const isCorrectSoFar = nextInput.every((key, index) => key === KONAMI_CODE[index]);

            if (isCorrectSoFar) {
                if (nextInput.length === KONAMI_CODE.length) {
                    callback();
                    setInput([]);
                } else {
                    setInput(nextInput);
                }
            } else {
                // If it doesn't match, reset but check if the current key is the start of the code
                if (e.key === KONAMI_CODE[0]) {
                    setInput([e.key]);
                } else {
                    setInput([]);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [input, callback]);

    return null;
};

export default useKonamiCode;
