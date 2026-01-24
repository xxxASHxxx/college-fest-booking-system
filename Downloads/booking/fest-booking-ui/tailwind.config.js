/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                neon: {
                    cyan: '#00FFFF',
                    pink: '#FF10F0',
                    purple: '#B026FF',
                    blue: '#0080FF',
                },
                dark: {
                    900: '#0f172a',
                    800: '#1e293b',
                    700: '#334155',
                }
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
                'neon-pink': '0 0 20px rgba(255, 16, 240, 0.5)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
