module.exports = {
  extends: '@webex/eslint-config-react',
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
    }],
    'require-jsdoc': 'off',
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'always-and-inside-groups'
    }]
  }
}
