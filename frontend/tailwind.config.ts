import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#090A12",
        surface: "#11131B",
        card: "#1A1C27",
        border: "rgba(255,255,255,0.08)",
        muted: "#8D93A5",
        text: "#C9CBD6",
        primary: "#FF8A00",
        accent: "#FF2D95",
      },
      fontFamily: {
        sans: ["Manrope", "Poppins", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
