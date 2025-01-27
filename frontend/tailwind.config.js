/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to your files
  ],
  theme: {
    extend: {
      colors: {
        background: "#210b2c", // Use as bg-background
        accent: "#55286f", // Use as bg-accent or text-accent
        foreground: "#bc96e6", // Use as bg-foreground or text-foreground
        text: "#d8b4e2", // Use as text-text
        button: {
          DEFAULT: "#ae759f", // Use as bg-button
          text: "#55286f", // Use as text-button-text
        },
      },
    },
  },
  plugins: [],
};
