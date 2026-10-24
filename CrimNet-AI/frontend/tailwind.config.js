/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          950: '#06090e',
          900: '#0a0f18',
          850: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
        },
        tactical: {
          crimson: '#ef4444',
          amber: '#f59e0b',
          emerald: '#10b981',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          blue: '#3b82f6',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace', 'Consolas'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 15px rgba(239, 68, 68, 0.4)',
        'glow-cyan': '0 0 15px rgba(6, 182, 212, 0.4)',
        'glow-amber': '0 0 15px rgba(245, 158, 11, 0.4)',
        'glow-violet': '0 0 15px rgba(139, 92, 246, 0.4)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.05)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
