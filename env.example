@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", "Noto Serif SC", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Noto Serif SC", "Cinzel", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;

  /* Custom Golden Zen Palette Colors */
  --color-gold-50: #fbf9f1;
  --color-gold-100: #f5eedc;
  --color-gold-200: #e5d5b7;
  --color-gold-500: #b8975a;
  --color-gold-600: #9e7d43;
  --color-gold-700: #846532;
  --color-gold-900: #49391f;

  --color-slate-900: #1c1c1a;
  --color-slate-950: #141412;
}

/* Base styling enhancements */
body {
  background-color: var(--color-gold-50);
  color: #2c2c28;
  font-family: var(--font-sans);
}

/* Custom scrollbar for high-end feel */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(184, 151, 90, 0.05);
}
::-webkit-scrollbar-thumb {
  background: rgba(184, 151, 90, 0.2);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(184, 151, 90, 0.4);
}

/* Animations */
@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 15px rgba(184, 151, 90, 0.1);
  }
  50% {
    box-shadow: 0 0 30px rgba(184, 151, 90, 0.3);
  }
}

.glow-gold {
  animation: pulseGlow 4s infinite ease-in-out;
}
