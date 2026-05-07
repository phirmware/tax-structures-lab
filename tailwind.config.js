/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae3',
          300: '#b0b8c8',
          400: '#8591a8',
          500: '#67738c',
          600: '#525c72',
          700: '#434b5d',
          800: '#3a414f',
          900: '#1c2030',
          950: '#11141d',
        },
        accent: {
          50: '#eef9f3',
          100: '#d6f1e2',
          200: '#afe2c7',
          300: '#7ecca6',
          400: '#4cb083',
          500: '#2e956a',
          600: '#207853',
          700: '#1c6044',
          800: '#1a4d38',
          900: '#163f2f',
        },
        warn: {
          500: '#d97706',
        },
        danger: {
          500: '#dc2626',
        },
      },
      animation: {
        flow: 'flow 2.5s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        fadeIn: 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        flow: {
          '0%': { strokeDashoffset: '20' },
          '100%': { strokeDashoffset: '0' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
