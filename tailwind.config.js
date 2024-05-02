/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#161921',
        dark_background: '#101218',
        darker_background: '#0c0e12',
        text_normal: '#ffffff',
        accent: '#25e8ac',
        alt_accent: '#006699',
      },
    },
  },
  plugins: [],
}