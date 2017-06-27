const path = require(`path`);
const {execSync} = require(`./exec`);
const {getPackage} = require(`./package`);
const rimraf = require(`rimraf`);


/**
 * Builds a specific package with Webpack
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {undefined}
 */
function webpackBuild(pkgName, pkgPath) {
  pkgPath = pkgPath || getPackage(pkgName);
  if (pkgPath) {
    try {
      const webpackConfigPath = path.resolve(__dirname, `webpack`, `webpack.prod.babel.js`);
      // Delete dist folder
      console.info(`Cleaning ${pkgName} dist folder...`.cyan);
      rimraf.sync(path.resolve(pkgPath, `dist`));
      console.info(`Building ${pkgName}...`.cyan);
      execSync(`cd ${pkgPath} && webpack --config ${webpackConfigPath}`);
      console.info(`${pkgName}... Done\n\n`.cyan);
    }
    catch (err) {
      throw new Error(`Error building ${pkgName} package, ${err}`, err);
    }
  }
  return false;
}


/**
 * Build a package using babel
 * @param {Stinrg} pkgName
 * @param {String} pkgPath
 */

function babelBuild(pkgName, pkgPath) {
  console.info(`Cleaning ${pkgName} dist folder...`.cyan);
  rimraf.sync(path.resolve(pkgPath, `es`));
  execSync(`cd ${pkgPath} && babel ./src --out-dir ./es --ignore *.test.js,__*__`);
}


module.exports = {
  webpackBuild,
  babelBuild
};
