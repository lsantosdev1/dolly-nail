/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dolly: {
          50: "#fdf8f6",
          100: "#f2e8e5",
          200: "#e5d3cd",
          300: "#d4b7ad",
          400: "#c19688",
          500: "#aa7869",
          600: "#946052",
          700: "#7a4d41",
          800: "#644037",
          900: "#533730",
        },
        roseGold: {
          DEFAULT: "#b76e79",
          light: "#d4a3a9",
          dark: "#8e4a54",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  plugins: [],
};
