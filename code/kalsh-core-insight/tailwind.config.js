/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Background colors - Web3 Terminal
        'bg-pure': '#000000',
        'bg-base': '#0a0a0a',
        'bg-surface': '#141414',
        'bg-elevated': '#1a1a1a',
        'bg-hover': '#1f1f1f',
        
        // Text colors
        'text-primary': '#e5e5e5',
        'text-secondary': '#a3a3a3',
        'text-muted': '#71717a',
        'text-emphasis': '#ffffff',
        
        // Accent colors - Terminal Matrix
        'accent-primary': '#00ff41',
        'accent-secondary': '#00ffff',
        'accent-warning': '#ffb700',
        'accent-danger': '#ff5757',
        
        // Status colors
        'status-bullish': '#00ff41',
        'status-bearish': '#ff5757',
        'status-neutral': '#a3a3a3',
        
        // Alert urgency colors
        'alert-high': '#ff5757',
        'alert-medium': '#ffb700',
        'alert-low': '#00ffff',
        
        // Legacy colors for compatibility
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#0a0a0a',
        foreground: '#e5e5e5',
        primary: {
          DEFAULT: '#00ff41',
          foreground: '#000000',
        },
        secondary: {
          DEFAULT: '#00ffff',
          foreground: '#000000',
        },
        accent: {
          DEFAULT: '#00ff41',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#ff5757',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#141414',
          foreground: '#a3a3a3',
        },
        card: {
          DEFAULT: '#141414',
          foreground: '#e5e5e5',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'h2': ['24px', { lineHeight: '1.4', fontWeight: '600' }],
        'h3': ['20px', { lineHeight: '1.4', fontWeight: '500' }],
        'data-lg': ['20px', { lineHeight: '1.5', fontWeight: '700' }],
        'data': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'xs': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      borderRadius: {
        none: '0px',
        sm: '4px',
        md: '8px',
        full: '9999px',
      },
      boxShadow: {
        'glow-green': '0 0 10px rgba(0,255,65,0.3)',
        'glow-green-lg': '0 0 20px rgba(0,255,65,0.4)',
        'glow-cyan': '0 0 10px rgba(0,255,255,0.3)',
        'glow-warning': '0 0 10px rgba(255,183,0,0.3)',
        'glow-danger': '0 0 10px rgba(255,87,87,0.3)',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0,255,65,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,255,65,0.5)' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      animation: {
        'cursor-blink': 'cursor-blink 0.8s step-end infinite',
        'glow-pulse': 'glow-pulse 2s ease-out',
        'slide-in-right': 'slide-in-right 0.4s ease-out',
        'fade-in': 'fade-in 0.25s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse': 'pulse 2s ease-in-out infinite',
      },
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '400ms',
      },
      transitionTimingFunction: {
        'sharp': 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
