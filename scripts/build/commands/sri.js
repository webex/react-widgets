const {generateDistSRI} = require('../../utils/sri');

module.exports = {
  command: 'sri <packageName>',
  desc: 'Generates SRI hash for all files and files in the sub-directories of /dist for the package',
  builder: {},
  handler: ({packageName}) => {
    if (!process.env.PRIVATE_KEY_PATH) {
      console.error('No private key found! Please set your PRIVATE_KEY_PATH environment variable');
      return false;
    }

    if (packageName) {
      return generateDistSRI({
        packagePath: `./packages/node_modules/@ciscospark/${packageName}`,
        privateKeyPath: process.env.PRIVATE_KEY_PATH,
        publicKeyPath: './public-key.pem',
        passphrase: process.env.PRIVATE_KEY_PASSPHRASE
      });
    }
    return false;
  }
};
