#!/usr/bin/env babel-node

module.export = require(`yargs`)
  .usage(`Usage: $0 <target> [args]`)
  .demandCommand(1, `Please let us know what you'd like to build.`)
  .commandDir(`./commands`)
  .help()
  .argv;
/**
 * Build Targets
 * - Bundle : Single JS file with everything
 * - CommonJS : Compiled source with all transforms and polyfills
 */
