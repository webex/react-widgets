#!/usr/bin/env babel-node
const path = require('path');

const {npmPublishPackage} = require('../../utils/publish');
const {getAllPackagePaths} = require('../../utils/package');

module.exports = {
  command: 'components',
  desc: 'Publish all component and module packages',
  builder: {},
  handler: () =>
    getAllPackagePaths().map((pkg) => {
      try {
        const pkgJson = require(path.resolve(pkg, 'package.json'));
        const pkgName = pkgJson.name.split('/').pop();
        const isWidget = pkgName.startsWith('widget-');
        if (!isWidget && !pkgJson.private) {
          return npmPublishPackage(pkgName);
        }
      }
      catch (err) {
        // Ignore errors
      }
      return false;
    })
};
