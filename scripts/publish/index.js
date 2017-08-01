#!/usr/bin/env babel-node
/**
 * Publish a Package
 */

require(`yargs`) // eslint-disable-line no-unused-expressions
  .usage(`Usage: $0 <target> [args]`)
  .commandDir(`commands`)
  .demandCommand(1, `Please let us know what package you'd like to publish.`)
  .help()
  .argv;

