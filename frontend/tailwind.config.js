/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'brand-blue': '#06397d',
          'brand-yellow': '#ffb634',
          'brand-white': '#fefefe',
        },
        fontFamily: {
          'sans': ['Montserrat', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }