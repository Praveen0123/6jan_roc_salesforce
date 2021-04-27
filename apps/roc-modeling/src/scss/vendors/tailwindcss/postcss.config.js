module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    require('tailwindcss')(
      'apps/roc-modeling/src/scss/vendors/tailwindcss/tailwind.config.js'
    ),
    require('autoprefixer'),
  ],
};
