/* filepath: d:\project\PgPaal\PgPaalWeb\tailwind.config.js */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ensure consistent purple shades
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764',
        },
        // Add custom gray scale
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-force-white': {
          color: '#ffffff !important',
        },
        '.text-force-black': {
          color: '#000000 !important',
        },
        '.text-force-gray-900': {
          color: '#111827 !important',
        },
        '.bg-force-transparent': {
          backgroundColor: 'transparent !important',
        },
        '.bg-force-white': {
          backgroundColor: '#ffffff !important',
        },
        '.border-force-white': {
          borderColor: '#ffffff !important',
        },
      };
      addUtilities(newUtilities);
    }
  ],
  // Safelist important classes to prevent purging
  safelist: [
    'text-white',
    'text-black',
    'text-gray-900',
    'text-purple-600',
    'text-purple-700',
    'text-purple-900',
    'bg-white',
    'bg-transparent',
    'bg-purple-600',
    'bg-purple-700',
    'border-white',
    'border-purple-600',
    'hover:text-white',
    'hover:bg-white',
    'hover:bg-purple-700',
    // Add mobile variants
    'md:text-white',
    'sm:text-white',
    'lg:text-white',
    // Force classes
    'text-force-white',
    'text-force-black',
    'bg-force-transparent',
    'bg-force-white',
    'border-force-white',
  ]
};