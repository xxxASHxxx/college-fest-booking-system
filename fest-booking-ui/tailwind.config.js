/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Brand Colors - FESTIFY
                'primary-dark': '#D00000',
                'secondary-dark': '#DC2F02',
                'teal-accent': '#FAA307',
                'warm-highlight': '#FFBA08',
                'accent-tertiary': '#E85D04',
                'accent-attention': '#F48C06',
                'destructive': '#9D0208',

                // Background
                'bg-dark': '#03071E',
                'bg-darker': '#03071E',
                'bg-card': '#370617',
                'bg-card-hover': '#6A040F',

                // Text
                'text-primary': '#F8F8F8',
                'text-secondary': '#D1D1D1',
                'text-muted': '#A0A0A0',

                // Semantic (keep existing structure)
                success: {
                    light: '#34D399',
                    DEFAULT: '#10B981',
                    dark: '#059669',
                },
                warning: {
                    light: '#FBBF24',
                    DEFAULT: '#F59E0B',
                    dark: '#D97706',
                },
                error: {
                    light: '#D00000',
                    DEFAULT: '#9D0208',
                    dark: '#6A040F',
                },
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            fontSize: {
                'xs': '0.75rem',
                'sm': '0.875rem',
                'base': '1rem',
                'lg': '1.125rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '3rem',
                '5xl': '4rem',
            },
            spacing: {
                '1': '0.125rem',
                '2': '0.25rem',
                '3': '0.5rem',
                '4': '0.75rem',
                '5': '1rem',
                '6': '1.25rem',
                '7': '1.5rem',
                '8': '2rem',
                '10': '2.5rem',
                '12': '3rem',
                '16': '4rem',
                '20': '5rem',
                '24': '6rem',
                '32': '8rem',
            },
            borderRadius: {
                'sm': '0.25rem',
                'md': '0.5rem',
                'lg': '0.75rem',
                'xl': '1rem',
                '2xl': '1.5rem',
                'full': '9999px',
            },
            boxShadow: {
                'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
                'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
                'lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
                'xl': '0 20px 25px rgba(0, 0, 0, 0.15)',
                '2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
                'glow': '0 0 20px rgba(250, 163, 7, 0.2)',
                'glow-accent': '0 0 20px rgba(220, 47, 2, 0.3)',
                'glow-primary': '0 0 30px rgba(208, 0, 0, 0.4)',
            },
            backdropBlur: {
                'xs': '2px',
                'sm': '4px',
                'md': '12px',
                'lg': '16px',
                'xl': '24px',
            },
            animation: {
                'fadeIn': 'fadeIn 0.3s ease-in-out',
                'slideUp': 'slideUp 0.4s ease-out',
                'slideDown': 'slideDown 0.3s ease-out',
                'scale': 'scale 0.3s ease-out',
                'shimmer': 'shimmer 2s infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scale: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
            },
            transitionDuration: {
                'fast': '150ms',
                'base': '200ms',
                'slow': '300ms',
                'slower': '500ms',
            },
        },
    },
    plugins: [],
}
