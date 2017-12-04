const path = require('path');
const {statSync, readdirSync} = require('fs');

const {execSync} = require('./exec');


/**
 * Get single packages full path
 * @param  {string} pkg specific package name or full path
 * @param  {string} packagesDir path where packages are stored
 * @returns {array} array of full path strings
 */
function getPackage(pkg, packagesDir = 'packages/node_modules/@ciscospark') {
  // check if this is a valid path
  try {
    if (statSync(pkg).isDirectory()) {
      const fullpath = path.resolve(pkg);
      statSync(path.resolve(fullpath, 'package.json'));
      return fullpath;
    }
  }
  catch (err) {
    if (err.code === 'ENOENT') {
      return getPackage(path.resolve(packagesDir, pkg));
    }
  }
  return false;
}


/**
 * Starts a specific package with Webpack Dev Server
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {undefined}
 */
function runInPackage({
  constructCommand,
  commandName,
  pkgName,
  pkgPath
}) {
  const outputPkgPath = getPackage(pkgName || pkgPath);
  if (pkgPath) {
    try {
      console.info(`${commandName} ${pkgName} ...`);
      const command = constructCommand(outputPkgPath);
      execSync(command)
        .catch((error) => {
          console.error(error.stdout);
          throw new Error(`Error when running ${commandName} on ${pkgName}`, error);
        });
    }
    catch (err) {
      throw new Error(`Error ${commandName} ${pkgName} package`, err);
    }
  }
}


/**
 * Get a list of all package paths
 * @param  {string} packagesDir path where packages are stored
 * @returns {array} array of full path strings
 */
function getAllPackagePaths(packagesDir = 'packages/node_modules/@ciscospark') {
  return readdirSync(packagesDir).reduce((acc, packagePath) => {
    const pkg = getPackage(packagePath, packagesDir);
    if (pkg) {
      acc.push(pkg);
    }
    return acc;
  }, []);
}

function getAllPackages(omitPrivate) {
  let pkgPaths = getAllPackagePaths();
  if (omitPrivate) {
    pkgPaths = pkgPaths.filter((pkgPath) => !require(path.resolve(pkgPath, 'package.json')).private);
  }
  return pkgPaths.map((pkgPath) => require(path.resolve(pkgPath, 'package.json')).name);
}

function getWidgetPackages() {
  const pkgPaths = getAllPackagePaths();
  return pkgPaths
    .filter((pkgPath) => {
      const pkgName = require(path.resolve(pkgPath, 'package.json')).name;
      return pkgName.startsWith('@ciscospark/widget') && !pkgName.startsWith('@ciscospark/widget-base');
    });
}

/**
 * Starts a specific package with Webpack Dev Server
 * @param  {string} pkgName Name of package without @ciscospark (e.g. react-component-button)
 * @param  {string} pkgPath Full path of package
 * @returns {Promise}
 */
function startPackage(pkgName, pkgPath) {
  return runInPackage({
    constructCommand: (targetPath) => `webpack-dev-server --config scripts/webpack/webpack.dev.babel.js --hot --inline --history-api-fallback --context ${path.resolve(targetPath, 'src')}`,
    commandName: 'Start Package',
    pkgName,
    pkgPath
  });
}


module.exports = {
  getWidgetPackages,
  getPackage,
  getAllPackages,
  getAllPackagePaths,
  runInPackage,
  startPackage
};
