/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        accent: 'var(--accent-color)',
        foreground: 'var(--foreground-color)',
        text: 'var(--text-color)',
        button: 'var(--button-color)',
        'button-text': 'var(--button-text-color)',
      },
      keyframes: {
        scroll1: {
          '0%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(-100%)' },
          '50.01%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        scroll2: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        scroll1: 'scroll1 200s linear infinite',
        scroll2: 'scroll2 200s linear infinite',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.perspective-1000': { perspective: '1000px' },
        '.transform-style-3d': { transformStyle: 'preserve-3d' },
        '.backface-hidden': { backfaceVisibility: 'hidden' },
        '.rotate-y-180': { transform: 'rotateY(180deg)' },
      });
    },
  ],
};
