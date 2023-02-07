const sharedConfig = require('jest-config-webex-int');
const path = require('path');

module.exports = {
  ...sharedConfig,
  setupFilesAfterEnv: [
    ...sharedConfig.setupFilesAfterEnv,
    path.resolve(__dirname, './src/test-utils/setupAfterEnv.ts'),
  ],
};
