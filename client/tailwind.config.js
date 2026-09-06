/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffe0e3",
          400: "#fb6f7f",
          500: "#f0324c",
          600: "#d21d3a",
          700: "#ac1530",
          900: "#5c0f1c",
        },
        ink: {
          900: "#20242d",
          800: "#292e38",
          700: "#343a46",
          600: "#414854",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
