import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        beer: {
          amber: '#F59E0B',
          'amber-dark': '#D97706',
          gold: '#D97706',
          brown: '#78350F',
          cream: '#FEF3C7',
          light: '#FFFBEB',
          dark: '#451A03',
          foam: '#FBBF24',
          malt: '#92400E',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
export default config 