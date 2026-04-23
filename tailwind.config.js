/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        surface: {
          DEFAULT: 'rgba(255, 255, 255, 0.7)',
          1: 'rgba(255, 255, 255, 0.8)',
          2: 'rgba(255, 255, 255, 0.4)',
          3: 'rgba(243, 244, 246, 0.6)',
        },
        accent: {
          DEFAULT: '#ff6b00',
          hover: '#e66000',
          soft: 'rgba(255, 107, 0, 0.1)',
        },
        border: {
          DEFAULT: 'rgba(0, 0, 0, 0.05)',
          strong: 'rgba(0, 0, 0, 0.1)',
        },
      },
      animation: {
        'fade-in': 'none',
        'slide-up': 'none',
        'scale-in': 'none',
        'shimmer': 'none',
        'slide-in-right': 'none',
      },
      keyframes: {
        // Keeping keyframes in case needed for specific manual transitions
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
