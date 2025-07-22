/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Mountain-themed color palette
        'snow': '#F8FAFC',
        'ice': '#E2E8F0',
        'fog': '#F1F5F9',
        'mist': '#CBD5E1',
        'stone': '#64748B',
        'rock': '#475569',
        'earth': '#334155',
        'cliff': '#1E293B',
        'night': '#0F172A',
        'summit': '#FFF7ED',
        'sunrise': '#FED7AA',
        'sunset': '#FDBA74',
        'alpine': '#065F46',
        'forest': '#064E3B',
        'grass': '#166534',
        'trail': '#B45309',
        'accent': '#0EA5E9',
        'accent-dark': '#0284C7',
        'danger': '#DC2626',
        'success': '#059669',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'climb': 'climb 0.8s ease-out',
        'pin-bounce': 'pin-bounce 0.6s ease-out',
        'trail-draw': 'trail-draw 1s ease-out forwards',
        'summit-celebrate': 'summit-celebrate 1.2s ease-out',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.8)' },
        },
        'sparkle': {
          '0%, 100%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'climb': {
          '0%': { transform: 'translateY(20px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0px) scale(1)', opacity: '1' },
        },
        'pin-bounce': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.3)' },
          '100%': { transform: 'scale(1)' },
        },
        'trail-draw': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'summit-celebrate': {
          '0%': { transform: 'scale(0.8) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' },
        },
      },
      backgroundImage: {
        'mountain-gradient': 'linear-gradient(135deg, #0F172A 0%, #1E293B 30%, #475569 60%, #CBD5E1 90%, #F8FAFC 100%)',
        'day-sky': 'linear-gradient(180deg, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)',
        'night-sky': 'linear-gradient(180deg, #0F172A 0%, #1E293B 30%, #334155 100%)',
        'sunset-sky': 'linear-gradient(180deg, #FED7AA 0%, #FDBA74 30%, #FB923C 60%, #F97316 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      perspective: {
        '1000': '1000px',
        '2000': '2000px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.perspective-2000': {
          perspective: '2000px',
        },
        '.transform-style-preserve-3d': {
          'transform-style': 'preserve-3d',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}