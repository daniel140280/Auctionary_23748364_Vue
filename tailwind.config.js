/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: {
            50: "#faf5f0",
            100: "#f4e8dc",
            200: "#e8d0b8",
            300: "#d9b38f",
            400: "#c99164",
            500: "#bd7447",
            600: "#af5d3b",
            700: "#924933",
            800: "#773d2f",
            900: "#613428",
          },
          accent: {
            50: "#f0f9ff",
            100: "#e0f2fe",
            200: "#b9e6fe",
            300: "#7cd4fd",
            400: "#36bffa",
            500: "#0ba5e9",
            600: "#0284c7",
            700: "#0369a1",
            800: "#075985",
            900: "#0c4a6e",
          },
        },
        fontFamily: {
          display: ["Playfair Display", "serif"],
          body: ["Inter", "sans-serif"],
        },
      },
    },
    plugins: [],
  };