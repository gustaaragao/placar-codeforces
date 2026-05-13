/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'm-primary': {
          '50': '#faf6fe',
          '100': '#f4eafd',
          '200': '#ead9fb',
          '300': '#dabaf8',
          '400': '#c38ef2',
          '500': '#ab63e9',
          '600': '#9d4edd',
          '700': '#8130c0',
          '800': '#6d2c9d',
          '900': '#59257e',
          '950': '#3c0f5c',
        },
        'm-secondary': {
          '50': '#fef1f6',
          '100': '#fee5f0',
          '200': '#ffcbe1',
          '300': '#ffa1c6',
          '400': '#ff70a6',
          '500': '#fa3a7d',
          '600': '#ea1857',
          '700': '#cc0a3e',
          '800': '#a80c34',
          '900': '#8c0f2f',
          '950': '#560116',
        },
        'm-tertiary': {
          '50': '#fbf5ff',
          '100': '#f6e8ff',
          '200': '#efd4ff',
          '300': '#e0aaff',
          '400': '#d282fe',
          '500': '#c153f9',
          '600': '#af31ec',
          '700': '#9820d0',
          '800': '#801faa',
          '900': '#681b88',
          '950': '#490665',
        },
        'm-neutral': {
          '50': '#fafafa',
          '100': '#f4f4f5',
          '200': '#e4e4e7',
          '300': '#d4d4d8',
          '400': '#a1a1aa',
          '500': '#71717a',
          '600': '#52525b',
          '700': '#3f3f46',
          '800': '#27272a',
          '900': '#121214',
          '950': '#09090b',
        }
      }
    }
  }
}
