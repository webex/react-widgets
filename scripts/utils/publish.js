const path = require('path');

const {runInPackage} = require('./package');

function npmPublishPackage(pkgName, pkgPath, npmTag) {
  return runInPackage({
    constructCommand: (targetPath) => `cd ${path.resolve(targetPath)} && npm publish --access public ${npmTag ? `--tag ${npmTag}` : ''}`,
    commandName: 'Publish Package to NPM',
    pkgName,
    pkgPath
  });
}

module.exports = {
  npmPublishPackage
};
