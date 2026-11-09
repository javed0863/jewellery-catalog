/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // warm ivory surface scale (page background → card → border → deep line)
        ivory: {
          50: '#FFFDF9',
          100: '#FAF6EF',
          200: '#F1E9DC',
          300: '#E6D9C3',
          400: '#D6C3A3',
        },
        // deep maroon — primary / brand
        maroon: {
          50: '#FBF1F2',
          100: '#F5DEE1',
          200: '#E8BCC2',
          300: '#D6909B',
          400: '#BC5F70',
          500: '#A03A4E',
          600: '#8C2D3F',
          700: '#7C2334',
          800: '#5E1B26',
          900: '#43141C',
        },
        // marigold / gold — accent
        marigold: {
          50: '#FDF8EC',
          100: '#FAEFCF',
          200: '#F3DDA1',
          300: '#EBC876',
          400: '#D9A441',
          500: '#C98F2E',
          600: '#B87333',
          700: '#94592A',
          800: '#7A4A26',
        },
        // henna green — success
        henna: {
          50: '#F0F7F1',
          100: '#DCEBDF',
          200: '#B9D6BE',
          500: '#4E7A58',
          600: '#3E6B4A',
          700: '#32543B',
        },
        // warm charcoal ink
        ink: {
          300: '#9A8B7B',
          400: '#6B5D50',
          500: '#55483D',
          700: '#3A2F26',
          900: '#2B2118',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(43, 33, 24, 0.05), 0 4px 16px rgba(43, 33, 24, 0.06)',
        lift: '0 2px 6px rgba(43, 33, 24, 0.08), 0 14px 30px rgba(43, 33, 24, 0.12)',
      },
    },
  },
  plugins: [],
}
