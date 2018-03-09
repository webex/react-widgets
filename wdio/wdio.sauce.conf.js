/* global browser */
require('dotenv').config();

const uuid = require('uuid');

process.env.SAUCE = true;
let {config} = require('./wdio.conf.js');

config.mochaOpts.timeout = 90000;
config.services = config.services.push('sauce');
// Disable since sauce already captures screenshots
config.screenshotOnReject = false;
const {beforeSuite} = config;

function sauceBeforeSuite() {
  beforeSuite();

  // Hack to display link to sauceLabs jobs when using multi remote
  const logTypes = browser.logTypes();
  Object.keys(logTypes).forEach((browserId) => {
    const logs = browser.select(browserId).log('browser');
    console.log(`🦄 Check out ${browserId} job at https://saucelabs.com/tests/${logs.sessionId} 🦄`);
  });
}

config.beforeSuite = sauceBeforeSuite;

config = Object.assign({}, config, {
  deprecationWarnings: false, // Deprecation warnings on sauce just make the logs noisy
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  sauceConnect: false
});

if (process.env.SAUCE_CONNECT) {
  const tunnelId = uuid.v4();
  config = Object.assign({}, config, {
    sauceConnect: true,
    sauceConnectOpts: {
      noSslBumpDomains: [
        '*.wbx2.com',
        '*.ciscospark.com',
        '*.webex.com',
        '127.0.0.1',
        'localhost',
        '*.clouddrive.com'
      ],
      tunnelDomains: [
        '127.0.0.1',
        'localhost'
      ],
      tunnelIdentifier: tunnelId,
      port: process.env.SAUCE_CONNECT_PORT || 4445
    }
  });
}

exports.config = config;
