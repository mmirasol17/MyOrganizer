/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ...colors,
        "custom-orange": "#ff765b",
        "custom-orange-dark": "#d9534f", // Use a darker shade for hover effect if desired
      },
    },
  },
  plugins: [],
};
