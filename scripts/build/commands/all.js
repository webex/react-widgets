const path = require(`path`);
const {
  webpackBuild,
  transpile
} = require(`../../utils/build`);
const {getAllPackagePaths} = require(`../../utils/package`);


module.exports = {
  command: `all`,
  desc: `Build all packages`,
  builder: {},
  handler: () =>
    getAllPackagePaths().map((pkg) => {
      try {
        const pkgJson = require(path.resolve(pkg, `package.json`));
        const pkgName = pkgJson.name.split(`/`).pop();
        const isWidget = pkgName.startsWith(`widget-`);
        if (isWidget && !pkgJson.private) {
          webpackBuild(pkgName, pkg);
        }
        return transpile(pkgName, pkg);
      }
      catch (err) {
        throw err;
      }
    })
};
