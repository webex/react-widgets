#!/usr/bin/env babel-node
/* eslint-disable no-sync */
const path = require(`path`);
const {execSync} = require(`./exec`);
const {getPackage} = require(`./package`);
const rimraf = require(`rimraf`);
const {transform} = require(`babel-core`);
const fs = require(`fs`);
const outputFileSync = require(`output-file-sync`);


/**
 * Builds a specific package with Webpack
 * @param  {string} pkgName
 * @param  {string} pkgPath
 * @returns {undefined}
 */
function webpackBuild(pkgName, pkgPath) {
  pkgPath = pkgPath || getPackage(pkgName);
  if (pkgPath) {
    try {
      const webpackConfigPath = path.resolve(__dirname, `..`, `webpack`, `webpack.prod.babel.js`);
      // Delete dist folder
      console.info(`Cleaning ${pkgName} dist folder...`.cyan);
      rimraf.sync(path.resolve(pkgPath, `dist`));
      console.info(`Bundling ${pkgName}...`.cyan);
      execSync(`cd ${pkgPath} && webpack --config ${webpackConfigPath}`);
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
  rimraf.sync(path.resolve(pkgPath, `cjs`));
  console.info(`Transpiling ${pkgName} to CommonJS...`.cyan);
  const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, `..`, `..`, `.babelrc`), `utf8`));
  babelrc.plugins.push(`transform-postcss`);
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
  rimraf.sync(path.resolve(pkgPath, `es`));

  console.info(`Transpiling ${pkgName} to ES5 with import/export ...`.cyan);
  const babelrc = JSON.parse(fs.readFileSync(path.resolve(__dirname, `..`, `..`, `.babelrc`), `utf8`));
  Object.assign(babelrc, {
    babelrc: false,
    sourceMaps: true,
    presets: [
      [
        `es2015`,
        {
          loose: true,
          modules: false
        }
      ],
      `react`
    ]
  });
  babelrc.plugins.push(`transform-postcss`);
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


function buildFile(filename, destination, babelOptions = {}) {
  const content = fs.readFileSync(filename, {encoding: `utf8`});
  const ext = path.extname(filename);
  const outputPath = path.join(destination, path.basename(filename));
  // Ignore non-JS files and test scripts
  if (!filename.includes(`.test.`)) {
    if (ext === `.js`) {
      babelOptions.filename = filename;
      const result = transform(content, babelOptions);
      return outputFileSync(outputPath, result.code, {encoding: `utf8`});
    }
    // process with postcss if it's a css file
    // else if (ext === `.css`) {
    //   return execSync(`postcss ${filename} -o ${outputPath}`);
    // }
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
      if (!filename.includes(`__`)) {
        babelBuild(filename, outputPath, babelOptions, false);
      }
    });
  }
}


module.exports = {
  webpackBuild,
  buildCommonJS,
  buildES,
  transpile
};
