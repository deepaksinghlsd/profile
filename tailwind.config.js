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
        primary: {
          50: '#f4f5f6',
          100: '#e9ebed',
          200: '#c8cbd0',
          300: '#a7abb4',
          400: '#656d7b',
          500: '#232e42', // Deep metallic slate primary color
          600: '#20293b',
          700: '#1b2332',
          800: '#151b27',
          900: '#111620',
          950: '#0b0e14',
        },
        accent: {
          blue: '#3b82f6',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          indigo: '#6366f1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 15s linear infinite',
      }
    },
  },
  plugins: [],
}
