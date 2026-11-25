import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: { DEFAULT: "#FAF8F5", deep: "#F1ECE3" },
        jade: { DEFAULT: "#1B4332", soft: "#2D6A4F", deep: "#0F2B1F" },
        gold: { DEFAULT: "#D4AF37", light: "#EBD27A", dark: "#A98417" },
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        // "Brushed gold" foil used on seals, rules and key buttons
        "gold-foil":
          "linear-gradient(135deg, #A98417 0%, #E9CF6F 38%, #D4AF37 62%, #9C7A12 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212,175,55,0.45)" },
          "50%": { boxShadow: "0 0 0 12px rgba(212,175,55,0)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.15", transform: "scale(0.8)" },
          "50%": { opacity: "0.9", transform: "scale(1.2)" },
        },
        "toast-in": {
          "0%": { opacity: "0", transform: "translateY(-16px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        float: "float 4.5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2.4s ease-out infinite",
        twinkle: "twinkle 3.6s ease-in-out infinite",
        "toast-in": "toast-in 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "spin-slow": "spin-slow 14s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
