const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./src/**/*.{ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.mono],
      },
      colors: {
        headerHov: "rgba(236,234,234,0.81)",
      },
    },
    backgroundColor: (theme) => ({
      ...theme("colors"),
      primary: "#00204E",
      secondary: "#FFFFFF",
      hover: "#00B5B5",
      selected: "#0171B7",
      background: "#F5F5F5",
    }),
  },
  variants: {
    extend: {
      fill: ["hover"],
    },
  },
  plugins: [],
};
