/** @type {import('tailwindcss').Config} */
export default {
  // ESSES CAMINHOS DIZEM AO TAILWIND ONDE PROCURAR CLASSES
  //O ** SIGNIFICA "EM QUALQUER SUBPASTA"
  //O {js,ts,jsx,tsx} SIGNIFICA "EM ARQUIVOS COM QUALQUER UMA DESSAS EXTENSÕES"
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'app':      'var(--bg-app)',
        'surface':  'var(--bg-surface)',
        'card':     'var(--bg-card)',
        'hover':    'var(--bg-hover)',
        'brand':    'var(--brand)',
        'accent':   'var(--accent)',
        'positive': 'var(--balance-positive)',
        'negative': 'var(--balance-negative)',
        'title':    'var(--text-title)',
        'muted':    'var(--text-muted)',
      },
      boxShadow: {
        'card':  'var(--shadow-card)',
        'brand': 'var(--shadow-brand)',
      },
      borderColor: {
        'default': 'var(--border)',
        'subtle':  'var(--border-subtle)',
      },
      fontFamily: {
        display: ['Ubuntu', 'sans-serif'],
        slab: ['Alfa Slab One', 'serif'], // TÍTULOS
        body: ['EB Garamond', 'serif' ],
      }
    },
  },
  plugins: [require('tailwind-scrollbar')],
}

