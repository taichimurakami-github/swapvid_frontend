/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    borderColor: (theme) => ({
      ...theme("colors"),
      default: "#4472C4",
      active: "#FF0000",
      hover: theme("colors.gray.300"),
      focus: "#FF0000",
      context: "#2dd4bf",
    }),

    extend: {
      boxShadow: {
        "3xl": "0 35px 60px -15px rgba(0, 0, 0, 0.3)",
        "4xl": "0 35px 60px -15px rgba(0, 0, 0, 0.6)",
        "player-active": "0 0px 30px 10px rgba(248, 250, 252, 1)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out forwards",
      },
    },
  },
  variants: {
    // ...
    borderColor: ["hover", "focus", "active", "context"],
  },
  plugins: [],
  content: ["./src/**/*.{js,jsx,ts,tsx,html}", "./public/index.html"],
};
