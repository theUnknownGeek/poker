/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          dark: '#0c0f14',
          card: '#161b22',
          cardBorder: '#28303e',
          green: '#10b981',
          greenDark: '#059669',
          gold: '#f59e0b',
          chipWhite: '#f8fafc',
          chipRed: '#ef4444',
          chipBlue: '#3b82f6',
          chipGreen: '#10b981',
          chipBlack: '#1e293b',
          chipPurple: '#a855f7'
        }
      }
    },
  },
  plugins: [],
}
