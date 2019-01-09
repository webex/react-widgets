const {updateAllPackageJson, updatePackageJson} = require('../../utils/deps');
const {getPackage} = require('../../utils/package');

module.exports = {
  command: 'package.json [packageName]',
  desc: 'Update all package.json',
  builder: {},
  handler: ({packageName}) => {
    if (packageName) {
      return updatePackageJson(getPackage(packageName));
    }

    return updateAllPackageJson();
  }
};
