module.exports = {
  root: true,
  extends: ['webex-int', 'plugin:storybook/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json'],
  },
  rules: {
    'jest/no-test-callback': 'off',
  },
};
