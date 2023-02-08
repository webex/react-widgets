const fs = require('fs');
const path = require('path');

const rimraf = require('rimraf');
const {transform} = require('@babel/core');
const outputFileSync = require('output-file-sync');

const babelConfig = require('../../babel.config');

const {getPackage} = require('./package');
const {execSync} = require('./exec');


function buildFile(filename, destination, babelOptions = {}) {
  const options = Object.assign({}, babelOptions);
  const content = fs.readFileSync(filename, {encoding: 'utf8'});
  const ext = path.extname(filename);
  const outputPath = path.join(destination, path.basename(filename));

  // Ignore non-JS files and test scripts
  if (!filename.includes('.test.')) {
    if (ext === '.js') {
      options.filename = filename;
      const result = transform(content, options);

      return outputFileSync(outputPath, result.code, {encoding: 'utf8'});
    }
    // process with postcss if it's a css file
    if (ext === '.css') {
      return execSync(`postcss ${filename} -o ${outputPath}`);
    }

    // Copy if it's any other type of file
    return outputFileSync(outputPath, content);
  }

  return false;
}

function babelBuild(folderPath, destination, babelOptions = {}, firstFolder = true) {
  const stats = fs.statSync(folderPath);

  if (stats.isFile()) {
    try {
      buildFile(folderPath, destination, babelOptions);
    }
    catch (err) {
      throw new Error(`Error transpiling ${folderPath} package, ${err}`, err);
    }
  }
  else if (stats.isDirectory()) {
    const outputPath = firstFolder ? destination : path.join(destination, path.basename(folderPath));
    const files = fs.readdirSync(folderPath).map((file) => path.join(folderPath, file));

    files.forEach((filename) => {
      // Ignore fixtures, mocks, and snapshots
      if (!filename.includes('__')) {
        babelBuild(filename, outputPath, babelOptions, false);
      }
    });
  }
}


/**
 * Builds a specific package with Webpack
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {undefined}
 */
function webpackBuild(pkgName, pkgPath) {
  const targetPkgPath = pkgPath || getPackage(pkgName);
  console.log('pkgPath:',`${pkgName}`)
  if (`${pkgName}` === 'widget-call-history') {
    try {
      const webpackConfigPath = path.resolve(__dirname, '..', 'webpack', 'webpack-calling.prod.babel.js');

      // Delete dist folder
      console.info(`Cleaning ${pkgName} dist folder...`.cyan);
      rimraf.sync(path.resolve(targetPkgPath, 'dist'));
      console.info(`Bundling ${pkgName}...`.cyan);
      execSync(`cd ${targetPkgPath} && webpack --config ${webpackConfigPath} --env.package=${pkgName}`);
      console.info(`${pkgName}... Done\n\n`.cyan);
    }
    catch (err) {
      throw new Error(`Error building ${pkgName} package, ${err}`, err);
    }
  }
  else if (targetPkgPath) {
    try {
      const webpackConfigPath = path.resolve(__dirname, '..', 'webpack', 'webpack.prod.babel.js');

      // Delete dist folder
      console.info(`Cleaning ${pkgName} dist folder...`.cyan);
      rimraf.sync(path.resolve(targetPkgPath, 'dist'));
      console.info(`Bundling ${pkgName}...`.cyan);
      execSync(`cd ${targetPkgPath} && webpack --config ${webpackConfigPath} --env.package=${pkgName}`);
      console.info(`${pkgName}... Done\n\n`.cyan);
    }
    catch (err) {
      throw new Error(`Error building ${pkgName} package, ${err}`, err);
    }
  }

  return false;
}


/**
 * Build a package to CommonJS
 * @param {String} pkgName
 * @param {String} pkgPath
 * @returns {undefined}
 */
function buildCommonJS(pkgName, pkgPath) {
  console.info(`Cleaning ${pkgName} cjs folder...`.cyan);
  rimraf.sync(path.resolve(pkgPath, 'cjs'));
  console.info(`Transpiling ${pkgName} to CommonJS...`.cyan);

  babelConfig.plugins.push('transform-postcss');
  babelBuild(`${pkgPath}/src`, `${pkgPath}/cjs`, babelConfig);
}


/**
 * Build a package to ES5 with import/export
 * @param {String} pkg
 * @returns {undefined}
 */
function buildES(pkg) {
  const targetPkgPath = getPackage(pkg);

  if (targetPkgPath) {
    try {
      const rollupConfigPath = path.resolve(__dirname, '..', '..', 'rollup.config.js');
      const callingRollupConfigPath = path.resolve(__dirname, '..', '..', 'rollup.calling-config.js');
      // Rollup cleans the `es` folder automatically
      console.info(`Packaging ${pkg}...`.cyan);

      execSync(`cd ${targetPkgPath} && rollup -c ${rollupConfigPath}`);

      console.info(`${pkg}... Done\n\n`.cyan);

      // execSync(`cd widgets && rollup -c ${callingRollupConfigPath}`);

    }
    catch (err) {
      throw new Error(`Error building ${pkg} package, ${err}`, err);
    }
  }

  return false;
}


/**
 * Build a package to ES5 and CommonJS
 * @param {String} pkgName
 * @param {String} pkgPath
 * @returns {Promise}
 */
function transpile(pkgName, pkgPath) {
  return Promise.all([
    buildES(pkgName, pkgPath),
    buildCommonJS(pkgName, pkgPath)
  ]);
}


module.exports = {
  webpackBuild,
  buildCommonJS,
  buildES,
  transpile
};
