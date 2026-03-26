/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontSize: {
        body: ['17px', { lineHeight: '1.55' }],
        'section-desc': ['18px', { lineHeight: '1.65' }],
        'card-desc': ['16px', { lineHeight: '1.75' }],
        eyebrow: ['13px', { lineHeight: '1.3', letterSpacing: '0.22em' }],
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#e63946',
          600: '#c1121f',
          700: '#9f1239',
          800: '#881337',
          900: '#4c0519',
        },
        brand: {
          bg:      '#0a0a0a',
          card:    '#141414',
          border:  'rgba(255,255,255,0.08)',
          muted:   '#9ca3af',
        },
      },
    },
  },
  plugins: [],
};
