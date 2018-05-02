#!/usr/bin/env babel-node
/**
 * Tooling Utilities
 * check-testable : Check if this build has anything to test. Prints "run" or "skip"
 */

require('dotenv').config();

// eslint-disable-reason not needed for command line
// eslint-disable-next-line no-unused-expressions
require('yargs')
  .usage('Usage: $0 <command> [args]')
  .commandDir('commands')
  .demandCommand(1, 'Please let us know what tool you\'d like to run.')
  .help()
  .argv;
