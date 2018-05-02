/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */

const wrapHandler = require('../../utils/wrap-handler');
const {lastLog} = require('../../utils/git');

module.exports = {
  command: 'check-testable',
  desc: 'Check if this build has anything to test. Prints "run" or "skip"',
  builder: {},
  handler: wrapHandler(async () => {
    const log = await lastLog();
    // Merge commits tend to have previous commit messages in them, so we want
    // to ignore them for when checking for commands
    if (!log.startsWith('Merge branch') && (log.includes('[ci skip]') || log.includes('[ci-skip]'))) {
      console.log('skip');
      return;
    }

    console.log('run');
  })
};
