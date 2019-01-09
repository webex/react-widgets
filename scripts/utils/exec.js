/**
 * Borrowed from React Bootstrap
 * https://github.com/react-bootstrap/react-bootstrap
 */
const {shellSync} = require('execa');

const processExec = require('child-process-promise').exec;

require('colors');

let executionOptions = {
  dryRun: false,
  verbose: true
};

/**
 * Write to console with additional prefixed information
 * @param {string} prefix
 * @param {string} message
 * @returns {undefined}
 */
function logWithPrefix(prefix, message) {
  console.log(
    message.toString().trim()
      .split('\n')
      .map((line) => `${prefix.grey} ${line}`)
      .join('\n')
  );
}

/**
 * Executes command and returns a Promise
 * @param {string} command
 * @param {object} options
 * @returns {Promise}
 */
function exec(command, options = {}) {
  const proc = processExec(command, options);

  if (!executionOptions.verbose) {
    return proc;
  }

  const title = options.title || command;

  return proc.progress(({stdout, stderr}) => {
    stdout.on('data', (data) => console.log(data));
    stderr.on('data', (data) => console.log(data));
  })
    .then((result) => {
      logWithPrefix(`[${title}]`, 'Complete'.cyan);

      return result;
    });
}

/**
 * Executes command with dry run and returns a Promise
 * @param {string} command
 * @param {object} options
 * @returns {Promise}
 */
function safeExec(command, options = {}) {
  const title = options.title || command;

  if (executionOptions.dryRun) {
    logWithPrefix(`[${title}]`.grey, 'DRY RUN'.magenta);

    return Promise.resolve();
  }

  return exec(command, options);
}

/**
 * Sets global exec options
 * @param {object} options
 * @returns {undefined}
 */
function setExecOptions(options) {
  executionOptions = {...executionOptions, ...options};
}

function execSync(command) {
  return shellSync(command, {stdio: 'inherit'});
}

module.exports = {
  exec,
  safeExec,
  setExecOptions,
  execSync
};
