module.exports = {
  root: true,
  // extends: ['webex-int', 'plugin:storybook/recommended'],
  extends: '@webex/eslint-config-react',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'jest/no-test-callback': 'off',
  },
};
