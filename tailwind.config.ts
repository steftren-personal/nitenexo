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
    },
  },
  plugins: [],
};

export default config;
