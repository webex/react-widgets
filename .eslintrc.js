module.exports = {
  parser: 'babel-eslint',
  extends: '@webex/eslint-config-react',
  env: {
    jest: true,
    browser: true
  },
  root: true,
  ignorePatterns: ['node_modules/'],
}
