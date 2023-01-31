module.exports = {
  root: true,
  // extends: ['webex-int'],
  extends: '@webex/eslint-config-react',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'jest/no-done-callback': 'off',
  },
};
