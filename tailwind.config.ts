import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
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
        // Core shadcn/ui variables
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

        // GuardianChain cyberpunk colors
        'neon': {
          DEFAULT: '#00ffe1',
          cyan: '#00ffe1',
          magenta: '#ff00d4',
          purple: '#7c3aed',
          green: '#10b981',
          orange: '#f79009',
        },
        'midnight': {
          DEFAULT: '#0a0f2c',
          100: '#161b22',
          200: '#21262d',
          300: '#30363d',
          400: '#484f58',
          500: '#6e7681',
        },
        'cyber': {
          cyan: 'hsl(180, 100%, 50%)',
          magenta: 'hsl(320, 100%, 50%)', 
          purple: 'hsl(285, 100%, 65%)',
          green: 'hsl(158, 64%, 52%)',
          orange: 'hsl(32, 95%, 55%)',
          blue: 'hsl(210, 100%, 60%)',
          red: 'hsl(348, 100%, 61%)',
          yellow: 'hsl(50, 100%, 60%)',
          pink: 'hsl(330, 100%, 70%)',
        },
      },
      fontFamily: {
        cyber: ['"Orbitron"', '"Space Grotesk"', 'sans-serif'],
        quantum: ['"Space Grotesk"', '"Inter"', 'sans-serif'], 
        code: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
        web3: ['"Inter"', '"Space Grotesk"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-cyber': 'linear-gradient(135deg, hsl(180, 100%, 50%) 0%, hsl(285, 100%, 65%) 35%, hsl(330, 100%, 50%) 70%, hsl(180, 100%, 50%) 100%)',
        'gradient-cosmic': 'linear-gradient(135deg, hsl(240, 100%, 5%), hsl(280, 100%, 8%))',
        'gradient-void': 'linear-gradient(135deg, hsl(240, 100%, 3%), hsl(260, 80%, 6%))',
      },
      boxShadow: {
        'neon': '0 0 20px hsl(180, 100%, 50%), 0 0 40px hsl(180, 100%, 50%)',
        'neon-magenta': '0 0 20px hsl(330, 100%, 50%), 0 0 40px hsl(330, 100%, 50%)',
        'neon-purple': '0 0 20px hsl(285, 100%, 65%), 0 0 40px hsl(285, 100%, 65%)',
        'glass': '0 8px 32px hsla(0, 0%, 0%, 0.37)',
      },
      backdropBlur: {
        'glass': '12px',
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
        "gradient-shift": {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        "neon-pulse": {
          'from': { boxShadow: '0 0 10px hsla(180, 100%, 50%, 0.5)' },
          'to': { boxShadow: '0 0 30px hsla(180, 100%, 50%, 0.8), 0 0 60px hsla(180, 100%, 50%, 0.4)' },
        },
        "glow-pulse": {
          '0%, 100%': { boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor' },
          '50%': { boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite alternate",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;

export default config;