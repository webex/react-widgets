import path from 'path';
import {exec} from './utils/exec';
import fs from 'fs';
import denodeify from 'denodeify';

const stat = denodeify(fs.stat);

/**
 * Builds a specific package with Webpack
 * @param  {string} pkgName
 * @returns {undefined}
 */
export default function buildPackage(pkgName) {
  const pkgPath = path.resolve(__dirname, `..`, `packages`, `node_modules`, `@ciscospark`, pkgName);
  return stat(pkgPath)
    .then((statObj) => {
      // If the folder doesn't exist do nothing
      if (!statObj.isDirectory()) {
        return false;
      }
      console.log(`Building ${pkgName} ...`.cyan);
      const webpackConfigPath = path.resolve(__dirname, `webpack`, `webpack.prod.babel.js`);
      // Delete dist folder
      return exec(`rimraf ${path.resolve(pkgPath, `dist`)}`)
        .then(() =>
          // Run webpack
          exec(`cd ${pkgPath} && webpack --config ${webpackConfigPath}`)
        ).catch((error) => {
          console.error(error.stdout);
          throw new Error(`Error when running webpack on ${pkgName}`, error);
        });
    })
    .catch((error) => {
      console.error(error);
      throw new Error(`Error building ${pkgName} package`, error);
    });
}

// Pass pkgName if running from command line
if (require.main === module) {
  buildPackage(process.argv[process.argv.length - 1]).catch((err) => {
    console.error(err);
    throw new Error(`build-package.js error \n ${err}`);
  });
}
