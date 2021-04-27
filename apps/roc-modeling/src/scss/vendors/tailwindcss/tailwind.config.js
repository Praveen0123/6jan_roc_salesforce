const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: {
    content: [
      'apps/roc-modeling/src/**/*.html',
      'apps/roc-modeling/src/**/*.ts',
    ],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderWidth: {
      DEFAULT: '1px',
      0: '0',
      2: '2px',
      3: '3px',
      4: '4px',
      6: '6px',
      8: '8px',
      10: '10px',
    },
    container: {
      center: true,
    },
    extend: {
      fontSize: {
        '2xs': '0.625rem',
      },
      colors: {
        primary: 'var(--color-primary)',
          colorApplication: {
          serachAllProgram: '#0866A0',
          horizontalLine:'#56B0B4'
        },
        currentState: {
          primary: 'var(--color-currentState-primary)',
          secondary: 'var(--color-currentState-secondary)',
        },
        goalState: {
          primary: 'var(--color-goalState-primary)',
          secondary: 'var(--color-goalState-secondary)',
        },
        alumniState: {
          primary: 'var(--color-alumniState-primary)',
          secondary: 'var(--color-alumniState-secondary)',
        },
        loanAccumulation: {
          primary: 'var(--color-loanAccumulation-primary)',
          secondary: 'var(--color-loanAccumulation-secondary)',
        },
        loanPayoff: {
          primary: 'var(--color-loanPayoff-primary)',
          secondary: 'var(--color-loanPayoff-secondary)',
        },
      },
    },
  },
  variants: {},
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('important', ({ container }) => {
        container.walkRules((rule) => {
          rule.selector = `.\\!${rule.selector.slice(1)}`;
          rule.walkDecls((decl) => {
            decl.important = true;
          });
        });
      });
    }),
  ],
};
