/* eslint-disable no-sync */

import path from 'path';
import {execSync} from './exec';
import {statSync, readdirSync} from 'fs';


/**
 * Starts a specific package with Webpack Dev Server
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {Promise}
 */
export function runInPackage({constructCommand, commandName, pkgName, pkgPath}) {
  pkgPath = getPackage(pkgName || pkgPath);
  if (pkgPath) {
    try {
      console.info(`${commandName} ${pkgName} ...`);
      const command = constructCommand(pkgPath);
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
  return false;
}


/**
 * Get a list of all package paths
 * @param  {string} packagesDir path where packages are stored
 * @returns {array} array of full path strings
 */
export function getAllPackagePaths(packagesDir = `packages/node_modules/@ciscospark`) {
  return readdirSync(packagesDir).reduce((acc, packagePath) => {
    const pkg = getPackage(packagePath, packagesDir);
    if (pkg) {
      acc.push(pkg);
    }
    return acc;
  }, []);
}


/**
 * Get single packages full path
 * @param  {string} pkg specific package name or full path
 * @param  {string} packagesDir path where packages are stored
 * @returns {array} array of full path strings
 */
export function getPackage(pkg, packagesDir = `packages/node_modules/@ciscospark`) {
  // check if this is a valid path
  try {
    if (statSync(pkg).isDirectory()) {
      const fullpath = path.resolve(pkg);
      statSync(path.resolve(fullpath, `package.json`));
      return fullpath;
    }
  }
  catch (err) {
    if (err.code === `ENOENT`) {
      return getPackage(path.resolve(packagesDir, pkg));
    }
  }
  return false;
}

export function getAllPackages() {
  const pkgPaths = getAllPackagePaths();
  return pkgPaths.map((pkgPath) => require(path.resolve(pkgPath, `package.json`)).name);
}
