/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: '#4A5240',
        'olive-dark': '#2E3328',
        carbon: '#1A1A1A',
        gunmetal: '#2C2C2C',
        khaki: '#C8B560',
        steel: '#8A9BA8',
        'off-white': '#E8E4D9',
        'danger-red': '#8B1A1A',
      },
      fontFamily: {
        oswald: ['Oswald', 'sans-serif'],
        shareTechMono: ['"Share Tech Mono"', 'monospace'],
        robotoCondensed: ['"Roboto Condensed"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

