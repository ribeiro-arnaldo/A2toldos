/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // Adicionando as cores da sua marca para fácil utilização
        colors: {
          'brand-blue': '#06397d',
          'brand-yellow': '#ffb634',
          'brand-white': '#fefefe',
        },
        // Definindo a fonte padrão do projeto
        fontFamily: {
          'sans': ['Montserrat', 'sans-serif'],
        }
      },
    },
    plugins: [],
  }