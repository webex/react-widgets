#!/usr/bin/env babel-node
const path = require('path');

const debug = require('debug')('scripts');

const {npmPublishPackage} = require('../../utils/publish');
const {getWidgetPackages} = require('../../utils/package');

module.exports = {
  command: 'widgets',
  desc: 'Publish specific widget packages',
  builder: {},
  handler: () =>
    getWidgetPackages().map((pkgPath) => {
      try {
        const pkgJson = require(path.resolve(pkgPath, 'package.json'));
        const pkgName = pkgJson.name.split('/').pop();
        // Only publish space and recents widgets
        const isPublished = ['widget-space', 'widget-recents'].indexOf(pkgName) !== -1;
        const isDemo = pkgName.endsWith('-demo');
        if (isPublished && !isDemo && !pkgJson.private) {
          debug(`Publishing: ${pkgName} from ${pkgPath}`);
          return npmPublishPackage(pkgName, pkgPath);
        }
      }
      catch (err) {
        // Ignore errors
      }
      return false;
    })
};
