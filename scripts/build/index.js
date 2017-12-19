#!/usr/bin/env babel-node
/**
 * Build Targets
 * Bundle : Single JS file with everything
 * CommonJS : Compiled source with all transforms and polyfills
 */

require('dotenv').config();

// eslint-disable-reason not needed for command line
// eslint-disable-next-line no-unused-expressions
require('yargs')
  .usage('Usage: $0 <target> [args]')
  .commandDir('commands')
  .demandCommand(1, 'Please let us know what you\'d like to build.')
  .help()
  .argv;
