import type { Config } from 'tailwindcss'

export default {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                // Surface layers — mockup-exact dark palette
                surface: {
                    base: '#000c0b',
                    DEFAULT: '#071e1c',
                    elevated: '#0d3a37',
                },
                // Brand cyan scale — high vibrancy from mockups
                cyan: {
                    DEFAULT: '#00f5d4',
                    hover: '#12e9d2',
                    dark: '#0d9488',
                },
                // Legacy teal aliases (used by DSA visual components)
                teal: {
                    300: '#12e9d2',
                    400: '#00f5d4',
                    600: '#0d9488',
                },
                // Accents
                border: '#1a3633',
                amber: { DEFAULT: '#f59e0b' },
                rose: { DEFAULT: '#f43f5e' },
                success: '#34d399',
                // Text
                primary: '#e2f0ef',
                muted: '#6b9e99',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            boxShadow: {
                'cyan-glow': '0 0 20px rgba(0,245,212,0.2)',
                'cyan-glow-lg': '0 0 40px rgba(0,245,212,0.3)',
                // Legacy aliases
                'teal-glow': '0 0 20px rgba(0,245,212,0.2)',
                'teal-glow-lg': '0 0 40px rgba(0,245,212,0.3)',
            },
            backgroundImage: {
                'card-gradient': 'linear-gradient(180deg, #0d3a37 0%, #071e1c 100%)',
                'page-gradient': 'radial-gradient(ellipse at 50% 0%, rgba(13,58,55,0.6) 0%, #000c0b 70%)',
                // Legacy alias
                'teal-gradient': 'linear-gradient(135deg, #0d9488 0%, #00f5d4 50%, #0891b2 100%)',
            },
            borderRadius: {
                'pill': '9999px',
            },
            keyframes: {
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                rankUpdate: {
                    '0%': { backgroundColor: 'rgba(0,245,212,0.2)' },
                    '100%': { backgroundColor: 'transparent' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            animation: {
                'slide-in': 'slideIn 0.25s ease-out',
                'rank-update': 'rankUpdate 0.6s ease-out',
                'fade-in': 'fadeIn 0.4s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
            },
        },
    },
} satisfies Config
