/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#5227FF',
                secondary: '#FF9FFC',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
            screens: {
                'xs': '400px',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
                'star-movement-bottom': 'star-movement-bottom linear infinite alternate',
                'star-movement-top': 'star-movement-top linear infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #5227FF' },
                    '100%': { boxShadow: '0 0 20px #FF9FFC' },
                },
                'star-movement-bottom': {
                    '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
                    '100%': { transform: 'translate(-100%, 0%)', opacity: '0' },
                },
                'star-movement-top': {
                    '0%': { transform: 'translate(0%, 0%)', opacity: '1' },
                    '100%': { transform: 'translate(100%, 0%)', opacity: '0' },
                },
            }
        },
    },
    plugins: [],
}
