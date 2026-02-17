/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'Inter Variable', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      colors: {
        ink: '#0f1117',
        bronze: '#c6a972',
        mist: '#e7ebf3',
        jade: '#2e8b72',
        ember: '#f4d79a',
        aurora: '#4ab8a4',
        velvet: '#111c2e',
      },
      boxShadow: {
        soft: '0 12px 40px rgba(14, 20, 30, 0.15)',
        aura: '0 14px 60px rgba(74, 184, 164, 0.25)',
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(1200px 600px at 10% -20%, rgba(198, 169, 114, 0.3), transparent 60%), radial-gradient(900px 500px at 85% 0%, rgba(46, 139, 114, 0.25), transparent 60%)',
        velvet:
          'radial-gradient(1200px 700px at 0% -15%, rgba(244, 215, 154, 0.2), transparent 60%), radial-gradient(1000px 650px at 100% 0%, rgba(74, 184, 164, 0.24), transparent 58%), linear-gradient(135deg, rgba(255,255,255,0.7), rgba(231,235,243,0.9))',
        'velvet-dark':
          'radial-gradient(1200px 700px at 0% -15%, rgba(244, 215, 154, 0.14), transparent 60%), radial-gradient(1000px 650px at 100% 0%, rgba(74, 184, 164, 0.16), transparent 58%), linear-gradient(135deg, rgba(17,28,46,0.9), rgba(15,17,23,0.95))',
      },
    },
  },
  plugins: [],
};
