/* eslint-disable no-empty-function */
module.exports = () => ({
  plugins: {
    'postcss-cssnext': {
      browsers: [`last 2 versions`, `IE > 10`]
    },
    cssnano: {
      preset: `default`,
      autoprefixer: false
    },
    'postcss-reporter': {}
  }
});
