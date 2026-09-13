/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Space Grotesk', 'system-ui', 'sans-serif'] },
      colors: {
        brute: {
          bg: '#1a1a1a',
          cream: '#FFFBF0',
          yellow: '#FFE500',
          pink: '#FF3366',
          cyan: '#00D4FF',
          lime: '#00FF88',
          black: '#000000',
        }
      },
      boxShadow: {
        brute: '4px 4px 0px 0px #000',
        'brute-lg': '6px 6px 0px 0px #000',
        'brute-xl': '8px 8px 0px 0px #000',
      },
      animation: {
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
      },
      keyframes: {
        bounceIn: {
          '0%': { transform: 'scale(0.8) translateY(20px)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
