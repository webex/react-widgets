/* eslint-disable no-sync */

import {readFileSync, writeFileSync} from 'fs';
import glob from 'glob';
import path from 'path';
import detective from 'detective-es6';
import builtinModules from 'builtin-modules';
import _ from 'lodash';
import {getAllPackages, getAllPackagePaths} from './utils/package';

export default function updatePackageJson() {
  const topPkgJson = JSON.parse(readFileSync(`./package.json`, `utf8`));
  const packages = getAllPackages();
  const pkgPaths = getAllPackagePaths();
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

    const uniqDeps = _.uniq(
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
      if (topPkgJson.dependencies[dep]) {
        deps[dep] = topPkgJson.dependencies[dep];
      }
      else if (packages.indexOf(dep) !== -1) { // eslint-disable-line no-negated-condition
        deps[dep] = topPkgJson.version;
      }
      else {
        throw new Error(`Unknown dependency ${dep}`);
      }
    });

    pkgJson[`module`] = `./src/index.js`;

    const jsonString = `${JSON.stringify(pkgJson, null, `  `)}\n`;
    writeFileSync(pkgJsonPath, jsonString, `utf8`);
  });
}


// Pass pkgName if running from command line
if (require.main === module) {
  updatePackageJson();
}
