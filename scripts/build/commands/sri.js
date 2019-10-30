const fs = require('fs');

const {generateDistSRI} = require('../../utils/sri');

module.exports = {
  command: 'sri <packageName>',
  desc: 'Generates SRI hash for all files and files in the sub-directories of /dist for the package',
  builder: {},
  handler: ({packageName}) => {
    if (!process.env.PRIVATE_KEY) {
      console.error('No private key found! Please set your PRIVATE_KEY environment variable');

      return false;
    }

    let privateKeyString = process.env.PRIVATE_KEY;

    // Since ENV Vars might not support newline characters, let's add them back
    // by replacing the string "\n" with actual new lines.
    privateKeyString = privateKeyString.replace(/\\n/g, '\n');

    // Crypto requires private key to be a buffer
    const privateKey = Buffer.from(privateKeyString, 'utf8');

    const publicKey = fs.readFileSync('./widget-key.pub', 'utf8');

    if (packageName) {
      return generateDistSRI({
        packagePath: `./packages/node_modules/@ciscospark/${packageName}`,
        privateKey,
        publicKey
      });
    }

    return false;
  }
};
