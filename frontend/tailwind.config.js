/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#dde7ff',
          200: '#c4d1ff',
          300: '#9fb1ff',
          400: '#7b8bff',
          500: '#5c67f5',
          600: '#4a4fea',
          700: '#3b3dcf',
          800: '#3135a8',
          900: '#2d3285',
          950: '#1b1d52',
        },
        surface: {
          DEFAULT: 'var(--bg-surface)',
          card: 'var(--bg-surface)',
          elevated: 'var(--bg-surface-elevated)',
          base: 'var(--bg-base)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(92, 103, 245, 0.3)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
