/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Rosemary"', 'serif'],
      },
      colors: {
        navy: {
          500: '#000080',
          600: '#000066',
        },
      },
    },
  },
  plugins: [],
}
