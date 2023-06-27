/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        colors: {
          orange: {
            200: "#FFE8CC",
          },
          amber: {
            200: "#FFEDD5",
          },
          yellow: {
            200: "#FEF3C7",
          },
          lime: {
            200: "#E3F9C1",
          },
          blue: {
            200: "#BEE3F8",
          },
          indigo: {
            200: "#C3DAFE",
          },
          violet: {
            200: "#DDD6FE",
          },
          purple: {
            200: "#E9D8FD",
          },
          fuchsia: {
            200: "#FDEBFF",
          },
          pink: {
            200: "#F9A8D4",
          },
          rose: {
            200: "#FECDD7",
          },
          gray: {
            200: "#E2E8F0",
          },
        },
      },
    },
  },
  plugins: [],
};
