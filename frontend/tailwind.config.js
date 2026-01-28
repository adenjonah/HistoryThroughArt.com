/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to your files
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
    },
  },
  plugins: [],
};
