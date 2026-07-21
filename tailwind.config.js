/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      colors: {
        forest: {
          DEFAULT: '#2d5016',
          light: '#3d6b1f',
          dark: '#1e3a0f',
        },
        mountain: {
          DEFAULT: '#6b8e23',
          light: '#8aa847',
        },
        sky: {
          DEFAULT: '#87ceeb',
          light: '#b0e0f5',
        },
        earth: {
          DEFAULT: '#8b4513',
          light: '#a05a2d',
        },
        snow: '#fffafa',
        apple: {
          DEFAULT: '#a63d40',
          light: '#c25557',
          dark: '#7d2a2c',
        },
      },
    },
  },
  plugins: [],
};
