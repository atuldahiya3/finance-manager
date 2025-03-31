// client/tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0d6efd',
          dark: '#0047b3'
        },
        secondary: {
          light: '#f39e58',
          DEFAULT: '#ed7d2b',
          dark: '#c45e1a'
        },
        success: {
          light: '#6fdc8c',
          DEFAULT: '#28a745',
          dark: '#1e7e34'
        },
        danger: {
          light: '#ff6b6b',
          DEFAULT: '#dc3545',
          dark: '#bd2130'
        },
        warning: {
          light: '#ffd166',
          DEFAULT: '#ffc107',
          dark: '#d39e00'
        },
        info: {
          light: '#7ed6df',
          DEFAULT: '#17a2b8',
          dark: '#117a8b'
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}