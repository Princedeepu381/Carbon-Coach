import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        deeper: "var(--bg-deeper)",
        primary: {
          DEFAULT: "var(--accent-green)",
          glow: "var(--accent-green-glow)",
        },
        secondary: "var(--accent-blue)",
        warning: "var(--accent-amber)",
        critical: "var(--accent-red)",
        "on-surface": "var(--text-primary)",
        "on-surface-variant": "var(--text-secondary)",
        muted: "var(--text-muted)",
        glass: {
          bg: "var(--glass-bg)",
          "bg-hover": "var(--glass-bg-hover)",
          border: "var(--glass-border)",
        },
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "3rem",
      },
      backdropBlur: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-plus-jakarta)", "sans-serif"],
        hanken: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        "orb-breathe": "breathe 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "tree-grow": "treeGrow 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.9" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        treeGrow: {
          "0%": { transform: "scaleY(0)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(1)", transformOrigin: "bottom" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
