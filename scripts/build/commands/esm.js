const {buildES} = require('../../utils/build');
const {getAllPackagePaths} = require('../../utils/package');

module.exports = {
  command: 'esm [packageName]',
  desc: 'Build a package for es module consumption',
  builder: {},
  handler: ({packageName}) => {
    if (packageName === 'all') {
      return getAllPackagePaths().forEach((pkg) => {
        buildES(pkg);
      });
    }

    if (packageName) {
      return buildES(packageName);
    }

    return false;
  }
};
