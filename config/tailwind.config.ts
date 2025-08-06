import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx}",
    "./client/src/pages/**/*.{js,ts,jsx,tsx}",
    "./client/src/components/**/*.{js,ts,jsx,tsx}",
    "./client/src/app/**/*.{js,ts,jsx,tsx}",
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
        // Cyberpunk Theme Colors
        midnight: {
          DEFAULT: "hsl(240, 100%, 3%)",
          200: "hsl(240, 100%, 5%)",
        },
        neon: {
          DEFAULT: "hsl(180, 100%, 50%)",
          cyan: "hsl(180, 100%, 50%)",
          purple: "hsl(285, 100%, 65%)",
          green: "hsl(120, 100%, 50%)",
          pink: "hsl(315, 100%, 70%)",
          yellow: "hsl(60, 100%, 60%)",
          blue: "hsl(220, 100%, 60%)",
        },
        electric: "hsl(285, 100%, 65%)",
        cosmic: {
          void: "hsl(240, 100%, 3%)",
          deep: "hsl(240, 100%, 5%)",
          nebula: "hsl(260, 80%, 6%)",
          surface: "hsl(240, 50%, 8%)",
          border: "hsl(240, 50%, 20%)",
        },
        glass: {
          light: "hsla(240, 50%, 15%, 0.8)",
          medium: "hsla(260, 40%, 12%, 0.9)",
          dark: "hsla(240, 100%, 5%, 0.95)",
        },
        viral: {
          electric: "hsl(285, 100%, 65%)",
          quantum: "hsl(120, 100%, 50%)",
          plasma: "hsl(315, 100%, 70%)",
          laser: "hsl(180, 100%, 50%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Fira Code", "JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        cyber: ["Orbitron", "monospace"],
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
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-in-from-top": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "fade-out": "fade-out 0.5s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.5s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.5s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.5s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.5s ease-out",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite alternate",
        "morphic-pulse": "morphic-pulse 4s ease-in-out infinite",
        "prismatic-shift": "prismatic-shift 6s linear infinite",
      },
      backgroundImage: {
        "quantum-gradient": "var(--quantum-gradient)",
        "cyberpunk": "linear-gradient(to right, #0f0c29, #302b63, #24243e)",
        "gradient-cyber": "linear-gradient(135deg, hsl(240, 100%, 3%), hsl(280, 100%, 5%), hsl(260, 80%, 6%))",
      },
      backdropFilter: {
        "glass": "var(--glass-backdrop)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

export default config;