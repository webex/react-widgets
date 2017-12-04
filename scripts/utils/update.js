#!/usr/bin/env babel-node
/**
 * This script allows you to upgrade all of the @ciscospark dependencies
 * to their latest version.
 */

const ncu = require('npm-check-updates');

ncu.run({
  // Always specify the path to the package file
  packageFile: 'package.json',
  // Any command-line option can be specified here.
  // These are set by default:
  filter: /^@ciscospark.*$/,
  upgrade: true
}).then(() => {
  console.log('@ciscospark dependencies upgraded');
});
