/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
      extend: {
        colors: {
          'airbnb-red': '#FF5A5F',
          'airbnb-dark-red': '#FF385C',
          'airbnb-black': '#222222',
          'airbnb-gray': '#717171',
          'airbnb-light-gray': '#DDDDDD',
        },
      },
    },
    plugins: [],
  }