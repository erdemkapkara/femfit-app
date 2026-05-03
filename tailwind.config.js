/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Phase 3 top-level palette (use as bg-sage, text-charcoal, etc.)
        sage:     '#8BA88F',
        peach:    '#FF9A86',
        orange:   '#FFB399',
        yellow:   '#FFD6A6',
        cream:    '#FFF0BE',
        charcoal: '#3A3A3A',
        coral:    '#FF6B6B',
        // Legacy femfit.* tokens kept for existing components
        femfit: {
          blush:  '#C9848A',
          rose:   '#E8B4B8',
          petal:  '#F5E6E8',
          mauve:  '#9B7B82',
          taupe:  '#8C7B6E',
          sand:   '#F0E8DF',
          linen:  '#FAF7F4',
          sage:   '#8FAF8A',
          mint:   '#D4E8D0',
          umber:  '#5C4A4A',
        }
      }
    },
  },
  plugins: [],
};
