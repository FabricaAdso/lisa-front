/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      mobile: '480px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1280px',
      desktop_xl: '1536px',
    },
    extend: {},
  },
  plugins: [],
}

