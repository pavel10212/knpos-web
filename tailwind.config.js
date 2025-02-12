/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000000",
        primary1: "#FF6B6B",
        secondary: "#4ECDC4",
        customYellow: "#FFC107",
        titleColour: "#000000",
      },
    },
  },
  plugins: [],
};
