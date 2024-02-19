/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          100: "#633CFF",
          200: "#BEADFF",
          300: "#EFEBFF",
          red: "#FF3939",
        },
        neutral: {
          100: "#333333",
          200: "#737373",
          300: "#D9D9D9",
          350: "#f5f5f5",
          400: "#FAFAFA",
        },
      },
      screens: {
        tn: "500px",
      },
      fontSize: {
        "heading-m": "2rem",
        "heading-s": "1.5rem",
        "body-m": "1rem",
        "body-s": "0.75rem",
      },
      leading: {
        main: "150%",
      },
      fontWeight: {
        "semi-bold": 600,
      },
    },
  },
  plugins: [],
};
