const path = require('path');

const {runInPackage} = require('./package');

function npmPublishPackage(pkgName, pkgPath) {
  console.log(pkgName,pkgPath)
  return runInPackage({
    constructCommand: (targetPath) => `cd ${path.resolve(targetPath)} && npm publish --access public`,
    commandName: 'Publish Package to NPM',
    pkgName,
    pkgPath
  });
}

module.exports = {
  npmPublishPackage
};
