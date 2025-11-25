/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        'cyber-green': '#00ff9f',
        'cyber-purple': '#d400ff',
        'cyber-blue': '#00a2ff',
        'cyber-orange': '#ff3c00',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'spin-slower': 'spin 15s linear infinite reverse',
      },
    },
  },
  plugins: [],
}
