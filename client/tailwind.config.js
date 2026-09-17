/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        henna: {
          50: '#FBF7F4',
          100: '#F5EBE4',
          200: '#EBD7CA',
          300: '#DABBA6',
          400: '#C8A27A',
          500: '#A67C52',
          600: '#8B5E3C',
          700: '#6B3E26',
          800: '#522E1A',
          900: '#3A1E10',
        },
        parchment: {
          50: '#FFFDF8',
          100: '#FAF7F2',
          200: '#F4ECE1',
          300: '#E8DCcb',
        },
        accent: {
          400: '#E4BD8D',
          500: '#D4A373',
          600: '#C8A27A',
        },
        espresso: {
          700: '#5A4636',
          800: '#3D2F24',
          900: '#2B2118',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Marcellus"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(107, 62, 38, 0.06), 0 1px 4px -1px rgba(107, 62, 38, 0.04)',
        'soft-md': '0 8px 24px -4px rgba(107, 62, 38, 0.08), 0 2px 6px -1px rgba(107, 62, 38, 0.04)',
        'soft-lg': '0 16px 36px -6px rgba(107, 62, 38, 0.12), 0 4px 12px -2px rgba(107, 62, 38, 0.06)',
        'gold-glow': '0 0 25px rgba(212, 163, 115, 0.35)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
