/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        forest: '#2d5016',
        mountain: '#6b8e23',
        sky: '#87ceeb',
        earth: '#8b4513',
        snow: '#fffafa',
      },
    },
  },
  plugins: [],
};
