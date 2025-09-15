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
      fontFamily: {
        serif: ['"EB Garamond"', '"Minion Pro"', '"Georgia"', 'serif'],
        sans: ['"EB Garamond"', '"Minion Pro"', '"Georgia"', 'serif'],
        inter: ['"EB Garamond"', '"Minion Pro"', '"Georgia"', 'serif'],
      },
      fontSize: {
        'hero': ['40px', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '600' }],
        'h1': ['32px', { lineHeight: '1.15', fontWeight: '600' }],
        'h2': ['28px', { lineHeight: '1.15', fontWeight: '600' }],
        'h3': ['24px', { lineHeight: '1.20', fontWeight: '600' }],
        'h4': ['20px', { lineHeight: '1.25', fontWeight: '600' }],
        'body': ['17px', { lineHeight: '1.50', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '1.50', fontWeight: '400' }],
        'lyric': ['17px', { lineHeight: '1.35', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '1.40', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.35', fontWeight: '400' }],
      },
      colors: {
        border: "hsl(var(--border))",
        "border-glass": "var(--border-glass)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        fg: "hsl(var(--fg))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          glow: "hsl(var(--primary-glow))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          dark: "hsl(var(--secondary-dark))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          dark: "hsl(var(--muted-dark))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          glass: "var(--card-glass)",
          foreground: "hsl(var(--card-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-divine": "var(--gradient-divine)",
        "gradient-glass": "var(--gradient-glass)",
        "gradient-hero": "var(--gradient-hero)",
      },
      boxShadow: {
        "soft": "var(--shadow-soft)",
        "medium": "var(--shadow-medium)",
        "elegant": "var(--shadow-elegant)",
        "glow": "var(--shadow-glow)",
        "divine": "var(--shadow-divine)",
        "glass": "var(--glass-shadow)",
        "glass-lg": "var(--glass-shadow-lg)",
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
