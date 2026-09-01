/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#f5f5f7',
          surface: '#ffffff',
          card: '#ffffff',
          text: '#1a1a1a',
          muted: '#6e6e73',
          border: '#e5e5ea',
          input: '#f2f2f7',
        },
        dark: {
          bg: '#0a0a0f',
          surface: '#13131a',
          card: '#1a1a24',
          text: '#e5e5e5',
          muted: '#8e8e93',
          border: '#2c2c3a',
          input: '#1c1c24',
        },
        accent: {
          blue: '#007AFF',
          purple: '#8b5cf6',
          teal: '#14b8a6',
          green: '#22c55e',
          orange: '#f97316',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'typing': 'typing 1.2s infinite ease-in-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        typing: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-4px)' } },
      },
    },
  },
  plugins: [],
}
