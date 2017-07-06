#!/usr/bin/env babel-node
/**
 * Start a widget
 */

require(`yargs`) // eslint-disable-line no-unused-expressions
  .usage(`Usage: $0 <target> [args]`)
  .commandDir(`commands`)
  .demandCommand(1, `Please let us know what you'd like to start.`)
  .help()
  .argv;

