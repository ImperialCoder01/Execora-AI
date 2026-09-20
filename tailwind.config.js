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
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: '#0EA5E9', // Primary Blue
          600: '#0284c7',
          700: '#0369a1',
          cyan: '#22D3EE',
          indigo: '#6366F1',
        },
        dark: {
          bg: '#0B1220',
          card: '#0F172A',
          cardHover: '#1E293B',
          border: '#1E293B',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
