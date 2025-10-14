/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4a90e2',
        secondary: '#666',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: {
          primary: '#333',
          secondary: '#666',
          placeholder: '#999',
        },
      },
    },
  },
  plugins: [],
}
