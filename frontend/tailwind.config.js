/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        pond: {
          bg: '#f0f8f4',
          dark: '#0d1f1a',
          green: '#2f6f55',
          teal: '#1d7f78',
          blue: '#2b5c85'
        }
      }
    }
  },
  plugins: []
};
