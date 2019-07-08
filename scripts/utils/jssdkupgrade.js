#!/usr/bin/env babel-node
/**
 * Upgrades to the highest version of @webex js-sdk packages
 * for use in the Jenkinsfile.jssdk script
 */
const path = require('path');

const packageJson = require('package-json');
const fs = require('fs-extra');

const psjson = require('../../package.json');

const dependencies = Object.keys(psjson.dependencies)
  .filter((key) => key.includes('@webex') && !key.includes('@webex/eslint-config'))
  .map((pkg) =>
    packageJson(pkg).then((result) => {
      psjson.dependencies[pkg] = result.version;
      console.log(`${pkg}: ${result.version}`);

      return Promise.resolve();
    }));

const devDependencies = Object.keys(psjson.devDependencies)
  .filter((key) => key.includes('@webex') && !key.includes('@webex/eslint-config'))
  .map((pkg) =>
    packageJson(pkg).then((result) => {
      psjson.devDependencies[pkg] = result.version;
      console.log(`${pkg}: ${result.version}`);

      return Promise.resolve();
    }));

Promise.all([...dependencies, ...devDependencies]).then(() => {
  fs.writeJSON(path.resolve(process.cwd(), './package.json'), psjson, {spaces: 2});
  console.log('@webex packages in package.json have been updated');
});

