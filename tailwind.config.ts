import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ["var(--font-orbitron)", "monospace"],
        rajdhani: ["var(--font-rajdhani)", "sans-serif"],
        mono: ["var(--font-share-tech)", "monospace"],
      },
      colors: {
        neon: {
          cyan: "#00f5ff",
          magenta: "#ff00a8",
          green: "#00ff88",
          yellow: "#ffee00",
          purple: "#bf00ff",
        },
        dark: {
          900: "#03030a",
          800: "#07070f",
          700: "#0d0d1a",
          600: "#12122a",
          500: "#1a1a35",
        },
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "scan-line": "scanLine 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glitch": "glitch 0.3s ease infinite",
        "border-spin": "borderSpin 4s linear infinite",
        "grid-move": "gridMove 20s linear infinite",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.7", filter: "brightness(1.4)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glitch: {
          "0%": { clipPath: "inset(40% 0 61% 0)" },
          "20%": { clipPath: "inset(92% 0 1% 0)" },
          "40%": { clipPath: "inset(43% 0 1% 0)" },
          "60%": { clipPath: "inset(25% 0 58% 0)" },
          "80%": { clipPath: "inset(54% 0 7% 0)" },
          "100%": { clipPath: "inset(58% 0 43% 0)" },
        },
        borderSpin: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gridMove: {
          "0%": { transform: "perspective(500px) rotateX(30deg) translateY(0)" },
          "100%": { transform: "perspective(500px) rotateX(30deg) translateY(80px)" },
        },
      },
      boxShadow: {
        "neon-cyan": "0 0 20px #00f5ff, 0 0 40px #00f5ff40",
        "neon-magenta": "0 0 20px #ff00a8, 0 0 40px #ff00a840",
        "neon-green": "0 0 20px #00ff88, 0 0 40px #00ff8840",
        "neon-purple": "0 0 20px #bf00ff, 0 0 40px #bf00ff40",
        "card-hover": "0 0 30px #00f5ff30, 0 0 60px #00f5ff10, inset 0 0 30px #00f5ff05",
      },
    },
  },
  plugins: [],
};

export default config;
