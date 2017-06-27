const {readFileSync, writeFileSync} = require(`fs`);
const glob = require(`glob`);
const path = require(`path`);
const detective = require(`detective-es6`);
const builtinModules = require(`builtin-modules`);
const {uniq} = require(`lodash`);
const {getAllPackages, getAllPackagePaths} = require(`./package`);

function updatePackageJson() {
  const topPkgJson = JSON.parse(readFileSync(`./package.json`, `utf8`));
  const packages = getAllPackages();
  const pkgPaths = getAllPackagePaths();
  console.log(packages);
  const flatten = (arr) => arr.reduce(
    (acc, val) => acc.concat(
      Array.isArray(val) ? flatten(val) : val
    ),
    []
  );

  pkgPaths.forEach((pkgPath) => {
    const pkgJsonPath = path.join(pkgPath, `package.json`);
    const pkgJson = JSON.parse(readFileSync(pkgJsonPath, `utf8`));

    // for the dependencies, find all require() calls
    const srcFiles = glob.sync(path.join(pkgPath, `src/**/*.js`), {
      ignore: [
        `**/*.test.js`,
        `**/__mocks__/*.js`,
        `**/fixtures/*.js`,
        `**/react-test-utils/**/*.js`
      ]
    });

    const uniqDeps = uniq(
      flatten(
        srcFiles.map(
          (srcFile) => {
            const code = readFileSync(srcFile, `utf8`);
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
        && !dep.includes(`react-intl/locale-data`)
        // local references
        && dep[0] !== `.`
    )
    .sort();
    const deps = pkgJson.dependencies = {};
    uniqDeps.forEach((dep) => {
      const depArray = dep.split(`/`);
      let cleanDep = depArray[0];
      if (depArray[0].startsWith(`@`)) {
        cleanDep = depArray.slice(0, 2).join(`/`);
      }
      if (topPkgJson.dependencies[cleanDep]) {
        deps[cleanDep] = topPkgJson.dependencies[cleanDep];
      }
      else if (packages.indexOf(cleanDep) !== -1) { // eslint-disable-line no-negated-condition
        deps[cleanDep] = topPkgJson.version;
      }
      else {
        throw new Error(`Unknown dependency ${cleanDep}`);
      }
    });

    pkgJson[`module`] = `./src/index.js`;

    const jsonString = `${JSON.stringify(pkgJson, null, `  `)}\n`;
    writeFileSync(pkgJsonPath, jsonString, `utf8`);
  });
}

module.exports = {
  updatePackageJson
};
