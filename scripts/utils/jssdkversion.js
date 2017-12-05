#!/usr/bin/env babel-node
/**
 * Gets the highest version of @ciscospark js-sdk packages
 * for use in the Jenkinsfile.jssdk script
 */
const semver = require('semver');

const psjson = require('../../package.json');

const dependencies = Object.keys(psjson.dependencies)
  .filter((key) => key.includes('@ciscospark') && !key.includes('@ciscospark/eslint-config'))
  .map((key) => psjson.dependencies[key].replace('^', '').replace('~', ''))
  .reduce((maxVer, currentVer) => (semver.gt(currentVer, maxVer) ? currentVer : maxVer));

const devDependencies = Object.keys(psjson.devDependencies)
  .filter((key) => key.includes('@ciscospark') && !key.includes('@ciscospark/eslint-config'))
  .map((key) => psjson.devDependencies[key].replace('^', '').replace('~', ''))
  .reduce((maxVer, currentVer) => (semver.gt(currentVer, maxVer) ? currentVer : maxVer));

const max = semver.gt(dependencies, devDependencies) ? dependencies : devDependencies;
console.log(max);
