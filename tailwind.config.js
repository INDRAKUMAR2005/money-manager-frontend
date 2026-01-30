/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050505',
                surface: '#121212',
                surfaceHighlight: '#1E1E1E',
                primary: '#CCFF00', // Neon Lime
                primaryDim: '#b3e600',
                secondary: '#7C3AED', // Electric Purple
                accent: '#06b6d4', // Cyan
                expense: '#FF3366', // Hot Pink
                income: '#00FFA3', // Bright Teal
            },
            fontFamily: {
                sans: ['Outfit', 'Inter', 'sans-serif'], // Outfit is more geometric/modern
                mono: ['Space Mono', 'monospace'],
            },
            boxShadow: {
                'neon-lime': '0 0 10px rgba(204, 255, 0, 0.3)',
                'neon-purple': '0 0 15px rgba(124, 58, 237, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            },
            backgroundImage: {
                'mesh': 'radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%)',
            }
        },
    },
    plugins: [],
}
