// tailwind.config.js
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        gray: colors.gray,
        blue: colors.blue, // ✅ use colors.blue
        red: colors.rose,
        pink: colors.fuchsia,
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
