/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./views/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        'primary-blue': '#3b82f6',
        'primary-blue-light': '#60a5fa',
        'primary-blue-dark': '#2563eb',
        'accent-blue': '#0ea5e9',
        'accent-indigo': '#6366f1',
        'dark-bg': '#0f172a',
        'dark-bg-lighter': '#1e293b',
      },
      animation: {
        'fadeInUp': 'fadeInUp 0.6s ease-out forwards',
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'scaleIn': 'scaleIn 0.5s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s infinite',
        'shimmer': 'shimmer 3s infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'loading-progress': 'loading-progress 2s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        scaleIn: {
          'from': { transform: 'scale(0.9)', opacity: '0' },
          'to': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        'pulse-subtle': {
          '0%': { opacity: '0.8' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.8' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'loading-progress': {
          '0%': { width: '0%', opacity: '1' },
          '50%': { width: '100%', opacity: '0.7' },
          '100%': { width: '100%', opacity: '0' },
        },
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0c4a6e 100%)',
        'blue-indigo-gradient': 'linear-gradient(90deg, #3b82f6, #6366f1)',
        'blue-teal-gradient': 'linear-gradient(90deg, #3b82f6, #0ea5e9, #0d9488)',
        'subtle-grid': 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      },
      boxShadow: {
        'blue-glow': '0 0 15px rgba(59, 130, 246, 0.5)',
        'blue-glow-sm': '0 0 10px rgba(59, 130, 246, 0.3)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.3), 0 0 10px rgba(59, 130, 246, 0.2)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}