const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.mono],
      },
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#00204E",
      secondary: "#ffffff",
      hover: "#00B5B5",
      background: "#F5F5F5",
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
