import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx,mdx}",
    "./client/index.html",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
        // Web3 and GuardianChain specific colors
        "neon-cyan": "hsl(var(--neon-cyan))",
        "neon-purple": "hsl(var(--neon-purple))",
        "neon-pink": "hsl(var(--neon-pink))",
        "blockchain-blue": "hsl(var(--blockchain-blue))",
        "ethereum-purple": "hsl(var(--ethereum-purple))",
        "polygon-purple": "hsl(var(--polygon-purple))",
        "truth-gold": "hsl(var(--truth-gold))",
        "grief-red": "hsl(var(--grief-red))",
        "capsule-green": "hsl(var(--capsule-green))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        quantum: ["Space Grotesk", "Inter", "sans-serif"],
        cyber: ["Fira Code", "JetBrains Mono", "monospace"],
        web3: ["Inter", "Space Grotesk", "sans-serif"],
        display: ["Space Grotesk", "sans-serif"],
        code: ["Fira Code", "monospace"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "morphic-pulse": "morphic-pulse 4s ease-in-out infinite",
        "prismatic-shift": "prismatic-shift 6s linear infinite",
        "data-stream": "data-stream 3s linear infinite",
        "epic-glow": "epic-glow 2s ease-in-out infinite",
        "rainbow-glow": "rainbow-glow 3s linear infinite",
        "particle-float": "particle-float 8s ease-in-out infinite",
        "neural-pulse": "neural-pulse 2s ease-in-out infinite",
        "quantum-pulse": "quantum-pulse 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-10px) rotate(1deg)" },
          "50%": { transform: "translateY(-20px) rotate(0deg)" },
          "75%": { transform: "translateY(-15px) rotate(-1deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(0, 255, 255, 0.6), 0 0 60px rgba(0, 255, 255, 0.3)" },
        },
        "morphic-pulse": {
          "0%, 100%": {
            transform: "scale(1) rotate(0deg)",
            borderRadius: "12px",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.4)",
          },
          "33%": {
            transform: "scale(1.02) rotate(1deg)",
            borderRadius: "16px",
            boxShadow: "0 0 30px rgba(138, 43, 226, 0.6)",
          },
          "66%": {
            transform: "scale(0.98) rotate(-1deg)",
            borderRadius: "8px",
            boxShadow: "0 0 25px rgba(255, 215, 0, 0.5)",
          },
        },
        "prismatic-shift": {
          "0%": { filter: "hue-rotate(0deg) saturate(1) brightness(1)" },
          "25%": { filter: "hue-rotate(90deg) saturate(1.2) brightness(1.1)" },
          "50%": { filter: "hue-rotate(180deg) saturate(1.4) brightness(1.2)" },
          "75%": { filter: "hue-rotate(270deg) saturate(1.2) brightness(1.1)" },
          "100%": { filter: "hue-rotate(360deg) saturate(1) brightness(1)" },
        },
        "data-stream": {
          "0%": { 
            backgroundPosition: "0% 0%",
            opacity: "0.3",
          },
          "50%": { 
            backgroundPosition: "100% 100%",
            opacity: "0.8",
          },
          "100%": { 
            backgroundPosition: "200% 200%",
            opacity: "0.3",
          },
        },
        "epic-glow": {
          "0%, 100%": {
            boxShadow: "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor",
          },
          "50%": {
            boxShadow: "0 0 20px currentColor, 0 0 40px currentColor, 0 0 60px currentColor, 0 0 80px currentColor",
          },
        },
        "rainbow-glow": {
          "0%": { filter: "hue-rotate(0deg)" },
          "100%": { filter: "hue-rotate(360deg)" },
        },
        "particle-float": {
          "0%, 100%": { 
            transform: "translateY(0px) translateX(0px) scale(1)",
            opacity: "0.6",
          },
          "25%": { 
            transform: "translateY(-20px) translateX(10px) scale(1.1)",
            opacity: "0.9",
          },
          "50%": { 
            transform: "translateY(-40px) translateX(-5px) scale(1.2)",
            opacity: "1",
          },
          "75%": { 
            transform: "translateY(-30px) translateX(-10px) scale(1.1)",
            opacity: "0.9",
          },
        },
        "neural-pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)",
            filter: "hue-rotate(0deg) brightness(1)",
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)",
            filter: "hue-rotate(90deg) brightness(1.2)",
          },
        },
        "quantum-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 40px hsla(51 100% 50% / 0.8), 0 0 80px hsla(51 100% 50% / 0.4), inset 0 2px 0 hsla(51 100% 70% / 0.5), 0 8px 32px rgba(0, 0, 0, 0.3)",
            transform: "scale(1)",
          },
          "50%": { 
            boxShadow: "0 0 60px hsla(51 100% 50% / 1), 0 0 120px hsla(51 100% 50% / 0.6), inset 0 2px 0 hsla(51 100% 70% / 0.7), 0 12px 48px rgba(0, 0, 0, 0.4)",
            transform: "scale(1.02)",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;