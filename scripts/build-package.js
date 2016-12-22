import path from 'path';
import {exec} from './utils/exec';

/**
 * Builds a specific package with Webpack
 * @param  {string} pkgName
 * @returns {undefined}
 */
export default function build(pkgName) {
  console.log(`Building: `.cyan + `distributable`.green);
  const webpackConfigPath = path.resolve(__dirname, `webpack`, `webpack.prod.babel.js`);
  const pkgPath = path.resolve(__dirname, `..`, `packages`, `node_modules`, pkgName);
  // const pkgJson = require(path.resolve(packagePath, `package.json`));
  // const rootPkgJson = require(path.resolve(__dirname, `..`, `package.json`));

  return exec(`rimraf ${path.resolve(pkgPath, `dist`)}`)
    .then(() => Promise.all([
      exec(`cd ${pkgPath} && webpack --config ${webpackConfigPath}`)
    ])).catch((reason) => {
      console.error(reason);
    });
}

if (require.main === module) {
  build(process.argv[process.argv.length - 1]).catch((err) => {
    throw new Error(`build-package.js error \n ${err.stack}`);
  });
}
