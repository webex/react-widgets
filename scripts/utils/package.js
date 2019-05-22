const path = require('path');
const {statSync, readdirSync} = require('fs');

const debug = require('debug')('scripts');

const {execSync} = require('./exec');

/**
 * Determines if a given path is a directory
 *
 * @param {string} dirPath full directory path
 * @returns {boolean}
 */
function isDirectory(dirPath) {
  try {
    if (statSync(dirPath).isDirectory()) {
      return true;
    }
  }
  catch (err) {
    return false;
  }

  return false;
}

/**
 * Checks if the given path is a directory containing a package.json file
 *
 * @param {string} packageDirectory
 * @returns {boolean}
 */
function isPackageDirectory(packageDirectory) {
  if (!isDirectory(packageDirectory)) {
    return false;
  }
  try {
    const fullpath = path.resolve(packageDirectory);

    if (statSync(path.resolve(fullpath, 'package.json')).isFile()) {
      return true;
    }
  }
  catch (err) {
    return false;
  }

  return false;
}

/**
 * Get single packages full path
 * @param  {string} pkg specific package name or full path
 * @returns {string} full path string or empty if failed
 */
function getPackage(pkg) {
  // check if this is a valid full package path
  if (isPackageDirectory(pkg)) {
    const fullpath = path.resolve(pkg);

    return fullpath;
  }
  // Attempt to determine path by pkg name
  let calculatedPackagesDir;
  const sparkFullPath = path.resolve('packages/node_modules/@ciscospark', pkg);
  const webexFullPath = path.resolve('packages/node_modules/@webex', pkg);
  const sparkPathExists = isDirectory(sparkFullPath);
  const webexPathExists = isDirectory(webexFullPath);

  if (sparkPathExists && webexPathExists) {
    console.error(`Unable to determine package path, multiple directories found for ${pkg}`);

    return '';
  }
  if (webexPathExists) {
    calculatedPackagesDir = webexFullPath;
  }
  if (sparkPathExists) {
    calculatedPackagesDir = sparkFullPath;
  }
  if (!isPackageDirectory(calculatedPackagesDir)) {
    console.error(`Unable to determine package path, no matching directory found for ${pkg}`);

    return '';
  }

  return calculatedPackagesDir;
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
  const outputPkgPath = getPackage(pkgPath || pkgName);

  if (outputPkgPath) {
    try {
      debug(`${commandName} ${pkgName} ...`);
      const command = constructCommand(outputPkgPath);

      execSync(command);
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
function getAllPackagePaths() {
  const fullPaths = [];
  const packagesDirs = ['packages/node_modules/@ciscospark', 'packages/node_modules/@webex'];

  packagesDirs.forEach((packagesDir) => {
    debug(`Reading Directory: ${packagesDir}`);
    readdirSync(packagesDir).forEach((packagePath) => {
      debug(`Reading Package Directory: ${packagePath}`);
      const fullpath = path.resolve(packagesDir, packagePath);

      if (isDirectory(fullpath)) {
        const pkg = getPackage(fullpath);

        if (pkg) {
          fullPaths.push(pkg);
        }
      }
    });
  });

  return fullPaths;
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

      return pkgName.startsWith('@ciscospark/widget') && !pkgName.endsWith('-demo');
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
    constructCommand: (targetPath) => `webpack-dev-server --config scripts/webpack/webpack.dev.babel.js --hot --inline --history-api-fallback --context ${path.resolve(targetPath, 'src')} --env.package=${pkgName}`,
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
