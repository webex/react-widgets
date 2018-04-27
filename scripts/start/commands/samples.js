const path = require('path');

const {execSync} = require('../../utils/exec');

module.exports = {
  command: 'samples',
  desc: 'Start the samples',
  builder: {},
  handler: () => {
    console.info('Starting the samples ...');
    const command = `webpack-dev-server --config scripts/webpack/webpack.dev.babel.js --hot --inline --history-api-fallback --context ${path.resolve('./samples')}`;
    execSync(command)
      .catch((error) => {
        console.error(error.stdout);
        throw new Error('Error when running start samples', error);
      });
  }
};
