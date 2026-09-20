import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07090d",
          900: "#0a0c10",
          800: "#10141b",
          700: "#171d27",
          600: "#232c3b",
        },
        paper: {
          DEFAULT: "#f4f2ec",
          dim: "#cfccc2",
        },
        primary: {
          DEFAULT: "#38bdf8",
          soft: "#22d3ee",
        },
        secondary: {
          DEFAULT: "#a78bfa",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
