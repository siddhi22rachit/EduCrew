/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out',
        'slideIn': 'slideIn 0.5s ease-out',
        'spin': 'spin 1s linear infinite',
        'meteor': 'meteor 5s linear infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'pulse': 'pulse 3s ease-in-out infinite',
        'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        meteor: {
          '0%': { transform: 'rotate(215deg) translateX(0)', opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { 
            transform: 'rotate(215deg) translateX(-500px)', 
            opacity: 0,
          }
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 1 }
        },
        pulse: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 }
        },
        ping: {
          '75%, 100%': {
            transform: 'scale(2)',
            opacity: '0'
          }
        }
      },
      boxShadow: {
        'glow': '0 0 10px 2px rgba(255, 255, 255, 0.3)',
        'glow-blue': '0 0 15px 5px rgba(59, 130, 246, 0.5)'
      }
    }
  },
  plugins: [],
}