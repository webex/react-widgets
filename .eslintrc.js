module.exports = {
  extends: '@ciscospark/eslint-config-react',
  env: {
    jest: true,
    browser: true
  },
  root: true,
  rules: {
    'operator-linebreak': ['error', 'before', {
      overrides: {
        '&&': 'ignore' // Used for conditional render in React components
      }
    }]
  }
}
