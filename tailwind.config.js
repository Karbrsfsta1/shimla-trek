/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        forest: {
          DEFAULT: '#1B2A1E',
          light: '#2A3D2E',
          dark: '#0F1A12',
        },
        mountain: {
          DEFAULT: '#3F6B3F',
          light: '#5A8A5A',
          dark: '#2D4D2D',
        },
        sky: {
          DEFAULT: '#6E93A8',
          light: '#9AB8C9',
          dark: '#4E7388',
        },
        earth: {
          DEFAULT: '#C1652F',
          light: '#D88450',
          dark: '#A04E1E',
        },
        snow: '#F7F5F0',
        apple: {
          DEFAULT: '#C1652F',
          light: '#D88450',
          dark: '#A04E1E',
        },
      },
    },
  },
  plugins: [],
};
