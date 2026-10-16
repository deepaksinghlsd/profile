/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          DEFAULT: '#c6f94e',
          soft: '#dcfb93',
          deep: '#9fd62a',
        },
        ink: {
          950: '#050506',
          900: '#0a0b0d',
          850: '#0e1012',
          800: '#131518',
          700: '#1b1e22',
          600: '#262a2f',
          500: '#3a3f46',
          400: '#6b717a',
          300: '#9aa0a8',
          200: '#c9cdd2',
          100: '#e8eaed',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans Devanagari"', 'system-ui', 'sans-serif'],
        display: ['Manrope', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
        wave: { '0%,100%': { transform: 'scaleY(0.35)' }, '50%': { transform: 'scaleY(1)' } },
        blink: { '0%,100%': { opacity: '0.25' }, '50%': { opacity: '1' } },
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        wave: 'wave 1.1s ease-in-out infinite',
        blink: 'blink 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
