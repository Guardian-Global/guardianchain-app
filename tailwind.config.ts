import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cyberpunk theme colors
        "cyber-cyan": "#00ffe1",
        "cyber-magenta": "#ff00d4", 
        "cyber-purple": "#7c3aed",
        "cyber-blue": "#0066ff",
        "cyber-dark": "hsl(218, 54%, 9%)",
        "cyber-surface": "hsl(218, 54%, 12%)",
        "truth-primary": "#00ffe1",
        "truth-secondary": "#ff00d4",
        "gtt-gold": "#ffd700",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "cyber-pulse": {
          "0%, 100%": { 
            opacity: "1",
            filter: "drop-shadow(0 0 8px #00ffe1)"
          },
          "50%": { 
            opacity: "0.6",
            filter: "drop-shadow(0 0 16px #00ffe1)"
          },
        },
        "data-stream": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        "holographic": {
          "0%, 100%": { 
            background: "linear-gradient(45deg, #00ffe1, #ff00d4)",
          },
          "50%": { 
            background: "linear-gradient(45deg, #ff00d4, #7c3aed)",
          },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "cyber-pulse": "cyber-pulse 2s ease-in-out infinite",
        "data-stream": "data-stream 3s linear infinite",
        "holographic": "holographic 4s ease-in-out infinite",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;