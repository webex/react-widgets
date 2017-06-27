#!/usr/bin/env babel-node
/**
 * Build Targets
 * Bundle : Single JS file with everything
 * CommonJS : Compiled source with all transforms and polyfills
 */

require(`yargs`) // eslint-disable-line no-unused-expressions
  .usage(`Usage: $0 <target> [args]`)
  .commandDir(`commands`)
  .demandCommand(1, `Please let us know what you'd like to build.`)
  .help()
  .argv;
