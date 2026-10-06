module.exports = {
  content: ["./html/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '"Inter"', "sans-serif"],
        display: ['"Inter"', '"Be Vietnam Pro"', "sans-serif"],
      },
      colors: {
        brand: {
          red: "#E50914",
          dark: "#0A0A0A",
          card: "#141414",
          light: "#F8F9FA",
          accent: "#222222",
          gray: "#8E8E93",
          border: "#2A2A2A",
          lightBorder: "#E5E7EB",
        },
      },
      letterSpacing: {
        tightest: "-.075em",
        superwide: "0.2em",
        mega: "0.25em",
      },
    },
  },
  plugins: [],
};
