/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    900: '#0a0a0a',
                    800: '#121212',
                    700: '#1a1a1a',
                    600: '#27272a'
                },
                neon: {
                    blue: '#00f0ff',
                    pink: '#ff003c',
                    green: '#00ff66',
                    purple: '#b026ff'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Syncopate', 'sans-serif'],
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #00f0ff, 0 0 10px #00f0ff' },
                    '100%': { boxShadow: '0 0 10px #ff003c, 0 0 20px #ff003c' }
                },
                marquee: {
                    '0%': { transform: 'translateX(100vw)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
}
