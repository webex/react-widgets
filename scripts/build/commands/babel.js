const path = require(`path`);
const rimraf = require(`rimraf`);
const {execSync} = require(`../../utils/exec`);

/**
 * Build a package using babel
 * @param {Stinrg} pkgName
 * @param {String} pkgPath
 */

function babelBuild(pkgName, pkgPath) {
  console.info(`Cleaning ${pkgName} dist folder...`.cyan);
  rimraf.sync(path.resolve(pkgPath, `dist`));
  execSync(`cd ${pkgPath} && babel ./src --out-dir ./dist/es --ignore *.test.js`);
}

module.exports = {
  command: `babel <packageName> [packagePath]`,
  desc: `Transpile a package with babel`,
  builder: {},
  handler: ({packageName, packagePath}) => {
    console.log(`stupid`);
    if (packageName) {
      if (packagePath) {
        return babelBuild(packageName, packagePath);
      }
      return babelBuild(packageName, `./packages/node_modules/@ciscospark/${packageName}`);
    }
    return false;
  }
};
