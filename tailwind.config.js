/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'

const colorArray = ['[#A3A3A3]', '[#00A2FF]', '[#CD7F32]', '[#C0C0C0]', '[#FFD700]', '[#E5E4E2]']
const colors = ['success', 'error', 'warning', 'info', 'accent', ...colorArray]
const safeColors = colors.flatMap((color) => [
  `badge-${color}`,
  `btn-${color}`,
  `bg-${color}`,
  `border-${color}`,
  `select-${color}`,
  `ring-${color}`,
])

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [...safeColors],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'sans-serif'],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: false, // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ':root', // The element that receives theme color CSS variables
  },
}
