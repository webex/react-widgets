const path = require(`path`);
const {runInPackage} = require(`./utils/package`);

/**
 * Starts a specific package with Webpack Dev Server
 * @param  {string} pkgName Name of package without @ciscospark (e.g. react-component-button)
 * @param  {string} pkgPath Full path of package
 * @returns {Promise}
 */
function startPackage(pkgName, pkgPath) {
  return runInPackage({
    constructCommand: (targetPath) => `npm run start -- --context ${path.resolve(targetPath, `src`)}`,
    commandName: `Start Package`,
    pkgName,
    pkgPath
  });
}

// Pass pkgName if running from command line
if (require.main === module) {
  startPackage(process.argv[process.argv.length - 1]).catch((err) => {
    console.error(err);
    throw new Error(`start-package.js error \n ${err}`);
  });
}

module.exports = {
  startPackage
};
