/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "480px",
        xxs: "380px",
      },
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        border: 'rgb(var(--border))',
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))',
        },
        destructive: 'rgb(var(--destructive))',
        ring: 'rgb(var(--ring))',
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'slide-in': 'slide-in 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'slide-out': 'slide-out 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'slide-out-right': 'slide-out-right 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'zoom-in': 'zoom-in 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'zoom-out': 'zoom-out 0.2s cubic-bezier(0.6, 0.6, 0, 1)',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'scale-out': 'scale-out 0.2s cubic-bezier(0.6, 0.6, 0, 1)',
        'accordion-down': 'accordion-down 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'accordion-up': 'accordion-up 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'fade-in': 'fade-in 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
        'fade-out': 'fade-out 0.3s cubic-bezier(0.6, 0.6, 0, 1)',
      },
      keyframes: {
        'slide-in': {
          from: {
            transform: 'translateX(-100%)',
          },
          to: {
            transform: 'translateX(0)',
          }
        },
        'slide-out': {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(-100%)',
          }
        },
        'slide-in-right': {
          from: {
            transform: 'translateX(100%)',
          },
          to: {
            transform: 'translateX(0)',
          }
        },
        'slide-out-right': {
          from: {
            transform: 'translateX(0)',
          },
          to: {
            transform: 'translateX(100%)',
          }
        },
        'zoom-in': {
          from: {
            transform: 'scale(0.95)',
          },
          to: {
            transform: 'scale(1)',
          }
        },
        'zoom-out': {
          from: {
            transform: 'scale(1)',
            opacity: 1,
          },
          to: {
            transform: 'scale(0.95)',
            opacity: 0,
          }
        },
        'scale-in': {
          from: {
            transform: 'scale(0.85)',
            opacity: 0,
          },
          to: {
            transform: 'scale(1)',
            opacity: 1,
          }
        },
        'scale-out': {
          from: {
            transform: 'scale(1)',
            opacity: 1,
          },
          to: {
            transform: 'scale(0.85)',
            opacity: 0,
          }
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--accordion-content-height)',
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--accordion-content-height)',
          },
          to: {
            height: '0',
          }
        },
        'fade-in': {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          }
        },
        'fade-out': {
          from: {
            opacity: 1,
          },
          to: {
            opacity: 0,
          }
        }
      }
    },
  },
  plugins: [],
}

