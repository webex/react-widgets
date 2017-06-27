import path from 'path';
import {execSync} from '../../utils/exec';
import {getPackage} from '../../utils/package';
import rimraf from 'rimraf';

/**
 * Builds a specific package with Webpack
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {undefined}
 */
export default function buildPackage(pkgName, pkgPath) {
  pkgPath = pkgPath || getPackage(pkgName);
  if (pkgPath) {
    const isWidget = pkgName.indexOf(`widget-`) !== -1;
    try {
      const webpackConfigPath = path.resolve(__dirname, `webpack`, `webpack.prod.babel.js`);
      // Delete dist folder
      console.info(`Cleaning ${pkgName} dist folder...`.cyan);
      rimraf.sync(path.resolve(pkgPath, `dist`));
      console.info(`Building ${pkgName}...`.cyan);
      if (isWidget) {
        execSync(`cd ${pkgPath} && webpack --config ${webpackConfigPath}`);
      }
      else {
        execSync(`cd ${pkgPath} && babel ./src --out-dir ./dist/es --ignore *.test.js`);
      }

      console.info(`${pkgName}... Done\n\n`.cyan);
    }
    catch (err) {
      throw new Error(`Error building ${pkgName} package, ${err}`, err);
    }
  }
  return false;
}

// Pass pkgName if running from command line
if (require.main === module) {
  buildPackage(process.argv[process.argv.length - 1]);
}
