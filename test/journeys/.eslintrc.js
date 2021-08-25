module.exports = {
  extends: '../../.eslintrc.js',
  env: {
    mocha: true
  },
  globals: {
    browser: false,
    browserLocal: false,
    browserRemote: false,
    $: false,
    $$: false,
    step: false
  },
  rules: {
    'no-console': 'off'
  }
};
