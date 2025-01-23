const animate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  safelist: ["dark"],
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

        // #region Custom Colors
        // Neutral Base (Grays and Whites)
        "neutral-100": "#F8F8F8",
        "neutral-200": "#EAEAEA",
        "neutral-300": "#D8D8D8",
        "neutral-400": "#C4C4C4",
        "neutral-500": "#A8A8A8",

        // Warm Beige Tones
        "beige-100": "#FDF6EE",
        "beige-200": "#F8EAD9",
        "beige-300": "#EEDCC5",
        "beige-400": "#D8C4A8",
        "beige-500": "#B6A186",

        // Sky Blue Tones
        "blue-100": "#EAF7FD",
        "blue-200": "#D5F0FA",
        "blue-300": "#B4E4F4",
        "blue-400": "#82CCE8",
        "blue-500": "#4BB3DC",

        // Earthy Greens
        "green-100": "#F2FAF5",
        "green-200": "#E2F3E7",
        "green-300": "#C3E7CE",
        "green-400": "#91D4AA",
        "green-500": "#57B77F",

        // Warm Coral/Amber Tones
        "coral-100": "#FFF7F5",
        "coral-200": "#FFE5DF",
        "coral-300": "#FFC9C2",
        "coral-400": "#FFA9A0",
        "coral-500": "#FF7C70",

        // Golden Yellows
        "yellow-100": "#FFFBEA",
        "yellow-200": "#FFF3C4",
        "yellow-300": "#FFE88D",
        "yellow-400": "#FFD75A",
        "yellow-500": "#FFC20A",

        // Blush Pinks
        "pink-100": "#FDF5F8",
        "pink-200": "#FBE8EE",
        "pink-300": "#F8CAD7",
        "pink-400": "#F5A4BA",
        "pink-500": "#EF678D",
        // #endregion
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "collapsible-down": {
          from: { height: 0 },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "collapsible-down": "collapsible-down 0.2s ease-in-out",
        "collapsible-up": "collapsible-up 0.2s ease-in-out",
      },
    },
  },
  plugins: [animate],
};
