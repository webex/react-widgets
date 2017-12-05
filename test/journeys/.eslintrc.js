module.exports = {
  extends: '../../.eslintrc.js',
  env: {
    mocha: true
  },
  globals: {
    browser: true,
    $: true
  },
  rules: {
    'no-console': 'off'
  }
};
