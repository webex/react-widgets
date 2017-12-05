module.exports = (ctx) => ({
  plugins: {
    'postcss-modules': {
      getJSON: ctx.extractModules || (() => {}),
      generateScopedName: '[local]--[hash:base64:5]'
    },
    'postcss-cssnext': {
      browsers: ['last 2 versions', 'IE > 10']
    },
    cssnano: {
      preset: 'default',
      autoprefixer: false
    },
    'postcss-reporter': {}
  }
});
