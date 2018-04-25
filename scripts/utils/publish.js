const path = require('path');

const {runInPackage} = require('./package');

function npmPublishPackage(pkgName) {
  return runInPackage({
    constructCommand: (targetPath) => `cd ${path.resolve(targetPath)} && npm publish --access public`,
    commandName: 'Publish Package to NPM',
    pkgName
  });
}

module.exports = {
  npmPublishPackage
};
