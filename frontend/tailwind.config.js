/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mint: '#B8E6D5',
      },
      fontFamily: {
        sans: ['Quicksand', 'ui-rounded', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
