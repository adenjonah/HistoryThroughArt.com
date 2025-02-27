module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        scroll1: {
          '0%': { transform: 'translateX(0%)' },
          '50%': { transform: 'translateX(-100%)' },
          '50.01%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' }
        },
        scroll2: {
          'from': { transform: 'translateX(100%)' },
          'to': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'scroll1': 'scroll1 200s linear infinite',
        'scroll2': 'scroll2 200s linear infinite'
      }
    }
  },
  plugins: [],
}; 