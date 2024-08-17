/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary': {
          '50': '#f1f8f3',
          '100': '#ddeee1',
          '200': '#bcdec6',
          '300': '#90c5a4',
          '400': '#61a67e',
          '500': '#3f8a60',
          DEFAULT: '#2e6e4c',
          '700': '#25573e',
          '800': '#1f4632',
          '900': '#1a3a2a',
          '950': '#0e2018',
        }
      },
      fontSize: {
        'heading': '2.5rem',
        'body-lg': '1.25rem',
        'body': '1rem',
      }
    },
  },
  plugins: ["@tailwindcss/forms"],
};
