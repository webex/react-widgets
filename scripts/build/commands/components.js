#!/usr/bin/env babel-node
const path = require(`path`);
const {
  transpile
} = require(`../../utils/build`);
const {getAllPackagePaths} = require(`../../utils/package`);


module.exports = {
  command: `components`,
  desc: `Build all component and module packages`,
  builder: {},
  handler: () => {
    getAllPackagePaths().forEach((pkg) => {
      try {
        const pkgJson = require(path.resolve(pkg, `package.json`));
        const pkgName = pkgJson.name.split(`/`).pop();
        const isWidget = pkgName.startsWith(`widget-`);
        if (!isWidget && !pkgJson.private) {
          transpile(pkgName, pkg);
        }
      }
      catch (err) {
        throw err;
      }
    });
  }
};
