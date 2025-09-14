import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
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
        // 80's Neon Colors
        neon: {
          cyan: "hsl(var(--neon-cyan))",
          pink: "hsl(var(--neon-pink))",
          green: "hsl(var(--neon-green))",
          orange: "hsl(var(--neon-orange))",
          purple: "hsl(var(--neon-purple))",
        },
        // Jamaica Colors
        jamaica: {
          green: "hsl(var(--jamaica-green))",
          yellow: "hsl(var(--jamaica-yellow))",
          red: "hsl(var(--jamaica-red))",
        },
      },
      fontFamily: {
        retro: ["var(--font-retro)"],
        body: ["var(--font-body)"],
      },
      backgroundImage: {
        "gradient-neon": "var(--gradient-neon)",
        "gradient-retro": "var(--gradient-retro)",
        "gradient-jamaica": "var(--gradient-jamaica)",
        "gradient-cyber": "var(--gradient-cyber)",
      },
      boxShadow: {
        "neon-cyan": "var(--shadow-neon-cyan)",
        "neon-pink": "var(--shadow-neon-pink)",
        "neon-green": "var(--shadow-neon-green)",
        combat: "var(--shadow-combat)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
