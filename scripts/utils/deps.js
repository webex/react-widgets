const {readFileSync, writeFileSync} = require('fs');
const path = require('path');

const glob = require('glob');
const detective = require('detective-es6');
const builtinModules = require('builtin-modules');
const {uniq} = require('lodash');

const {getAllPackages, getAllPackagePaths} = require('./package');

const flatten = (arr) => arr.reduce(
  (acc, val) => acc.concat(
    Array.isArray(val) ? flatten(val) : val
  ),
  []
);


function updatePackageJson(pkgPath, packages, topPkgJson) {
  let outputPackages = packages;
  if (!outputPackages) {
    outputPackages = getAllPackages();
  }

  let outputTopPkgJson = topPkgJson;
  if (!outputTopPkgJson) {
    outputTopPkgJson = JSON.parse(readFileSync('./package.json', 'utf8'));
  }

  const pkgJsonPath = path.join(pkgPath, 'package.json');
  const pkgJson = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));

  // for the dependencies, find all require() calls
  const srcFiles = glob.sync(path.join(pkgPath, 'src/**/*.js'), {
    ignore: [
      '**/*.test.js',
      '**/__mocks__/*.js',
      '**/__fixtures__/*.js',
      '**/react-test-utils/**/*.js'
    ]
  });

  const uniqDeps = uniq(
    flatten(
      srcFiles.map(
        (srcFile) => {
          const code = readFileSync(srcFile, 'utf8');
          try {
            return detective(code);
          }
          catch (e) {
            return [];
          }
        }
      )
    )
  )
    .filter((dep) =>
      // built in modules
      builtinModules.indexOf(dep) === -1
        // react-intl locale imports
        && !dep.includes('react-intl/locale-data')
        // local references
        && dep[0] !== '.')
    .sort();

  pkgJson.dependencies = {};
  const deps = pkgJson.dependencies;

  uniqDeps.forEach((dep) => {
    const depArray = dep.split('/');
    let cleanDep = depArray[0];
    if (depArray[0].startsWith('@')) {
      cleanDep = depArray.slice(0, 2).join('/');
    }
    if (outputTopPkgJson.dependencies[cleanDep]) {
      deps[cleanDep] = outputTopPkgJson.dependencies[cleanDep];
    }
    else if (outputPackages.indexOf(cleanDep) !== -1) { // eslint-disable-line no-negated-condition
      deps[cleanDep] = outputTopPkgJson.version;
    }
    else {
      throw new Error(`Unknown dependency ${cleanDep}`);
    }
  });

  pkgJson.version = outputTopPkgJson.version;

  const jsonString = `${JSON.stringify(pkgJson, null, '')}\n`;
  writeFileSync(pkgJsonPath, jsonString, 'utf8');
}

/**
 * Updates all package.json files with depedencies
 * @returns {undefined}
 */
function updateAllPackageJson() {
  const packages = getAllPackages();
  const pkgPaths = getAllPackagePaths();
  const topPkgJson = JSON.parse(readFileSync('./package.json', 'utf8'));
  console.log(packages);

  pkgPaths.forEach((pkgPath) => updatePackageJson(pkgPath, packages, topPkgJson));
}

module.exports = {
  updateAllPackageJson,
  updatePackageJson
};
