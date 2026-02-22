import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--bg)",
        foreground: "var(--fg)",
        green: "var(--green)",
        red: "var(--red)",
        amber: "var(--amber)",
        blue: "var(--blue)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular"],
      },
      keyframes: {
        floatSlow: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(40px,-30px,0) scale(1.1)" },
          "100%": { transform: "translate3d(-10px,20px,0) scale(0.95)" },
        },
      },
      animation: {
        floatSlow: "floatSlow 18s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
