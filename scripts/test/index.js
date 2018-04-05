#!/usr/bin/env babel-node
/**
 * Some tools for testing
 */

// eslint-disable-reason not needed for command line
// eslint-disable-next-line no-unused-expressions
require('yargs')
  .usage('Usage: $0 <target> [args]')
  .commandDir('commands')
  .demandCommand(1, 'Please let us know what test tools you\'d like to use.')
  .help()
  .argv;
