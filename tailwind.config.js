/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mountain: {
          snow: '#FFFFFF',
          ice: '#E0E7FF',
          fog: '#9CA3AF',
          stone: '#6B7280',
          earth: '#92400E',
          cliff: '#374151',
          night: '#1F2937',
          summit: '#F59E0B'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'climb': 'climb 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        climb: {
          '0%, 100%': { transform: 'translateX(0px) rotate(0deg)' },
          '50%': { transform: 'translateX(5px) rotate(2deg)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(147, 51, 234, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}