const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.mono],
      }
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#00204E",
      background: "#F5F5F5",
    }),
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
