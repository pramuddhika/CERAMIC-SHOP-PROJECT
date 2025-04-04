/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#6794A0",
      }
    },
    width: {
      'calc': 'calc(100% - 180px)',
    },
  },
  plugins: [],
}

