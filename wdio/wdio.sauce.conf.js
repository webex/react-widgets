require('dotenv').config();

const uuid = require('uuid');

const {getSauceConcurrency} = require('../scripts/utils/sauce');

process.env.SAUCE = true;
let {config} = require('./wdio.conf.js');

config.mochaOpts.timeout = 90000;
config.services = [
  'sauce'
];

if (process.env.BROWSER && process.env.BROWSER.includes('firefox')) {
  config.services.push('firefox-profile');
}

const baseOnPrepare = config.onPrepare;

config.onPrepare = function onPrepare(conf, capabilities) {
  baseOnPrepare(conf, capabilities);
  // eslint-disable-next-line no-use-before-define
  const concurrencyTimer = setInterval(checkConcurrency, 30000);

  function checkConcurrency() {
    getSauceConcurrency((data) => {
      const {ancestor} = data.concurrency;
      const remaining = ancestor.allowed.overall - ancestor.current.overall;
      if (remaining >= 4) {
        clearInterval(concurrencyTimer);
        return;
      }
      console.warn(`Sauce Labs only has ${remaining} idle containers, waiting for more to become available`);
    });
  }
};

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
