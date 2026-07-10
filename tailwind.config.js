/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          950: '#08080a',
          900: '#0d0d10',
          800: '#151518',
          700: '#1e1e22',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.12)',
        },
        accent: {
          DEFAULT: '#7c5cfc',
          soft: '#9d85ff',
          muted: '#5b3fd6',
        },
        loved: '#fb7185',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
        '3xl': '64px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 40px -8px var(--accent-glow, rgba(124, 92, 252, 0.6))',
        'glow-lg': '0 0 80px -12px var(--accent-glow, rgba(124, 92, 252, 0.55))',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'zoom-slow': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(-24px) translateX(12px)' },
        },
        'float-alt': {
          '0%, 100%': { transform: 'translateY(0px) translateX(0px)' },
          '50%': { transform: 'translateY(20px) translateX(-16px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        eq: {
          '0%, 100%': { height: '20%' },
          '50%': { height: '100%' },
        },
        'border-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 var(--accent-glow, rgba(124, 92, 252, 0.55))' },
          '70%': { boxShadow: '0 0 0 14px rgba(124, 92, 252, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(124, 92, 252, 0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'zoom-slow': 'zoom-slow 12s ease-out forwards',
        'spin-slow': 'spin-slow 18s linear infinite',
        float: 'float 9s ease-in-out infinite',
        'float-alt': 'float-alt 11s ease-in-out infinite',
        shimmer: 'shimmer 1.8s infinite linear',
        'border-flow': 'border-flow 6s ease infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
