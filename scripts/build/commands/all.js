const path = require(`path`);
const buildPackage = require(`./build-package`);
const {getAllPackagePaths} = require(`../../utils/package`);

// Run buildPackage on all of our packages
function buildAllPackages() {
  getAllPackagePaths().map((pkg) => {
    try {
      const pkgName = require(path.resolve(pkg, `package.json`)).name.split(`/`).pop();
      return buildPackage(pkgName, pkg);
    }
    catch (err) {
      throw err;
    }
  });
}

module.exports = {
  command: `all`,
  desc: `Build all packages`,
  builder: {},
  handler: () => buildAllPackages()
};
