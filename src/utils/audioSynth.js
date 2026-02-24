// Native Web Audio API Synthesizer 
// Guarantees zero network requests, zero CORS issues, and no HTML5 Audio pool exhaustion.

let audioCtx = null;

const getAudioContext = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

export const playClick = () => {
    try {
        const ctx = getAudioContext();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.05);

        gain.gain.setValueAtTime(0.1, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
    } catch (err) {
        console.warn('Audio Synthesis blocked:', err);
    }
};

export const playWhoosh = () => {
    try {
        const ctx = getAudioContext();
        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.exponentialRampToValueAtTime(1200, t + 0.15);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
        gain.gain.linearRampToValueAtTime(0.001, t + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.15);
    } catch (err) {
        console.warn('Audio Synthesis blocked:', err);
    }
};

export const createHum = () => {
    let osc = null;
    let gain = null;

    const start = () => {
        try {
            const ctx = getAudioContext();
            osc = ctx.createOscillator();
            gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = 55; // Deep 55Hz vibration

            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 1); // Fade in

            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
        } catch (err) {
            console.warn('Audio Synthesis blocked:', err);
        }
    };

    const stop = () => {
        if (osc && gain) {
            try {
                const ctx = getAudioContext();
                gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.5); // Fade out
                setTimeout(() => {
                    osc.stop();
                    osc.disconnect();
                    gain.disconnect();
                }, 500);
            } catch (err) { }
        }
    };

    return { start, stop };
};
