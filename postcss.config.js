/* eslint-disable no-empty-function */
module.exports = (ctx) => ({
  plugins: {
    'postcss-modules': {
      getJSON: ctx.extractModules || (() => {})
    },
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
