/*!
 * Copyright (c) 2015-2017 Cisco Systems, Inc. See LICENSE file.
 */
const {shellSync} = require('execa');

const debug = require('debug')('tooling:git');

exports.lastLog = function lastLog() {
  // When we're running on Jenkins, we know there's an env var called GIT_COMMIT
  const treeLike = process.env.GIT_COMMIT || 'HEAD';
  const cmd = `git log -n 1 --format=%B ${treeLike}`;

  debug(`Shelling out to ${cmd}`);
  const {stdout} = shellSync(cmd);

  debug('Done');

  return stdout;
};
