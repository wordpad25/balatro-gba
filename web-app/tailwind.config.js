/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'balatro-red': '#ff4d4d',
        'balatro-blue': '#4d4dff',
        'balatro-yellow': '#ffff4d',
      }
    },
  },
  plugins: [],
}
