import type { Config } from "tailwindcss";

// Tailwind is the project's declared styling layer. The Botwerk look itself is
// driven by the design tokens (CSS custom properties) in app/globals.css, which
// we expose here so utilities can reach them when handy. Components mostly use
// the tokens directly to stay 1:1 with the design system.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvasDark: "var(--surface-canvas-dark)",
        night: "var(--surface-night)",
        canvasLight: "var(--surface-canvas-light)",
        lime: "var(--color-accent-lime)",
        pink: "var(--color-accent-pink)",
        ink: "var(--ink)",
      },
      maxWidth: {
        container: "var(--container-max)",
      },
      borderRadius: {
        xl2: "var(--rounded-xxl)",
      },
      animation: {
        first: "moveVertical 30s ease infinite",
        second: "moveInCircle 20s reverse infinite",
        third: "moveInCircle 40s linear infinite",
        fourth: "moveHorizontal 40s ease infinite",
        fifth: "moveInCircle 20s ease infinite",
      },
      keyframes: {
        moveHorizontal: {
          "0%": { transform: "translateX(-50%) translateY(-10%)" },
          "50%": { transform: "translateX(50%) translateY(10%)" },
          "100%": { transform: "translateX(-50%) translateY(-10%)" },
        },
        moveInCircle: {
          "0%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(180deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        moveVertical: {
          "0%": { transform: "translateY(-50%)" },
          "50%": { transform: "translateY(50%)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
