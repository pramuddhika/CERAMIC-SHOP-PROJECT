/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#4B527E",
      }
    },
    width: {
      'calc': 'calc(100% - 180px)',
    },
  },
  plugins: [],
}

