const path = require(`path`);
const rimraf = require(`rimraf`);
const {execSync} = require(`./utils/exec`);

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
  command: `build [packageName]`,
  desc: `Transpile a package with babel`,
  builder: {

  },
  handler: wrapHandler(async ({packageName}) => {
    if (packageName) {
      await buildPackage(packageName);
    }
    else {
      for (const pName of await list()) {
        await buildPackage(pName);
      }
    }
  })
};
