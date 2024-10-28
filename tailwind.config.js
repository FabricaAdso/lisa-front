/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      screens : {
        'movil': '640px',
        'tablet': '768px',
        'portail': '1024px',
        'computador': '1280px',
        'computadorXL': '1536px',
        },

    },
  },
  plugins: [],
}

