#!/usr/bin/env babel-node
/**
 * Deploy code to different paces
 */

// eslint-disable-reason not needed for command line
// eslint-disable-next-line no-unused-expressions
require('yargs')
  .usage('Usage: $0 <target> [args]')
  .commandDir('commands')
  .demandCommand(1, 'Please let us know what you would like to deploy.')
  .help()
  .argv;

