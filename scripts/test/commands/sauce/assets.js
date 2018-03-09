const {getSauceAsset} = require('../../utils/sauce');

module.exports = {
  command: 'assets <jobId> <filename> [destination]',
  desc: 'Download assets from a SauceLabs job',
  builder: {
    jobId: {
      describe: 'SauceLabs Job Id'
    },
    fileName: {
      describe: 'Filename of the asset you\'d like to download'
    },
    destination: {
      describe: 'Path to save the file'
    }
  },
  handler: ({jobId, fileName, destination}) => {
    getSauceAsset(jobId, fileName, destination);
  }
};
