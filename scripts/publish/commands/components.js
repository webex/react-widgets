const path = require('path');

const {npmPublishPackage} = require('../../utils/publish');
const {getAllPackagePaths} = require('../../utils/package');

module.exports = {
  command: 'components',
  desc: 'Publish all component and module packages',
  builder: {},
  handler: () =>
    getAllPackagePaths().map((pkgPath) => {
      console.log(pkgPath)
      try {
        const pkgJson = require(path.resolve(pkgPath, 'package.json'));
        const pkgName = pkgJson.name.split('/').pop();
        const isDemo = pkgName.endsWith('-demo');
        console.log(pkgJson,pkgName,isDemo)
        if (!isDemo && !pkgJson.private) {
          return npmPublishPackage(pkgName, pkgPath);
        }
      }
      catch (err) {
        // Ignore errors
      }

      return false;
    })
};
