#!/usr/bin/env babel-node
const fs = require('fs');
const path = require('path');

const rimraf = require('rimraf');
const {transform} = require('babel-core');
const outputFileSync = require('output-file-sync');

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
  if (targetPkgPath) {
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
 * Builds a specific package with Webpack
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {undefined}
 */
function webpackTranspile(pkgName, pkgPath) {
  const targetPkgPath = pkgPath || getPackage(pkgName);
  if (targetPkgPath) {
    try {
      const webpackConfigPath = path.resolve(__dirname, '..', 'webpack', 'webpack.transpile.babel.js');
      // Delete dist folder
      console.info(`Cleaning ${targetPkgPath}/es folder...`.cyan);
      rimraf.sync(path.resolve(targetPkgPath, 'es'));
      console.info(`Transpiling ${pkgName}...`.cyan);
      execSync(`cd ${targetPkgPath} && pwd && webpack --config ${webpackConfigPath} --env.package=${pkgName}`);
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
 * @param {Stinrg} pkgName
 * @param {String} pkgPath
 * @returns {undefined}
 */
function buildCommonJS(pkgName, pkgPath) {
  console.info(`Cleaning ${pkgName} cjs folder...`.cyan);
  rimraf.sync(path.resolve(pkgPath, 'cjs'));
  console.info(`Transpiling ${pkgName} to CommonJS...`.cyan);
  const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', '.babelrc'), 'utf8'));
  babelrc.plugins.push('transform-postcss');
  babelBuild(`${pkgPath}/src`, `${pkgPath}/cjs`, babelrc);
}


/**
 * Build a package to ES5 with import/export
 * @param {Stinrg} pkgName
 * @param {String} pkgPath
 * @returns {undefined}
 */
function buildES(pkgName, pkgPath) {
  console.info(`Cleaning ${pkgName} es folder...`.cyan);
  rimraf.sync(path.resolve(pkgPath, 'es'));

  console.info(`Transpiling ${pkgName} to ES5 with import/export ...`.cyan);
  const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', '..', '.babelrc'), 'utf8'));
  Object.assign(babelrc, {
    babelrc: false,
    sourceMaps: true,
    presets: [
      [
        'env',
        {
          targets: {
            node: '6.5'
          },
          modules: false
        }
      ],
      'react'
    ]
  });
  babelrc.plugins.push('transform-postcss');
  return babelBuild(`${pkgPath}/src`, `${pkgPath}/es`, babelrc);
}


/**
 * Build a package to ES5 and CommonJS
 * @param {Stinrg} pkgName
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
  webpackTranspile,
  buildCommonJS,
  buildES,
  transpile
};
