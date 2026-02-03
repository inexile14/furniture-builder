/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Workshop palette - warm woodworking tones
        workshop: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8dcc8',
          300: '#d4c4a8',
          400: '#c4a882',
          500: '#b08d5c',
          600: '#9a7348',
          700: '#7d5c3a',
          800: '#664a30',
          900: '#533d28',
          950: '#2d2015',
        },
        // Wood species colors
        maple: {
          light: '#E8D4B8',
          DEFAULT: '#DCC9A9',
          dark: '#C9B68E',
        },
        plywood: {
          light: '#E5CBA8',
          DEFAULT: '#D4A574',
          dark: '#B8935E',
        },
        walnut: {
          light: '#9e826a',
          DEFAULT: '#7a5f47',
          dark: '#5f4a38',
        },
        cherry: {
          light: '#d48f79',
          DEFAULT: '#b86a50',
          dark: '#955540',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
