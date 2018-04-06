require('dotenv').config();

const uuid = require('uuid');

const {inject} = require('../scripts/utils/tests/openh264');

process.env.SAUCE = true;

let {config} = require('./wdio.conf.js');

config.seleniumArgs = {};
config.seleniumInstallArgs = {};

config.logOutput = './reports/wdio/';

config.onPrepare = function onPrepare(conf, caps) {
  const defs = Object.keys(caps).map((c) => caps[c].desiredCapabilities);
  /* eslint-disable no-param-reassign */
  defs.forEach((d) => {
    d.build = process.env.BUILD_NUMBER || `local-${process.env.USER}-wdio-${Date.now()}`;
    d.version = d.version || 'latest';
    d.platform = d.platform.toLowerCase().includes('mac') || d.platform === 'darwin' ? 'OS X 10.12' : d.platform;
  });
  /* eslint-enable no-param-reassign */
  return inject(defs);
};

if (process.env.SAUCE_CONNECT) {
  const tunnelId = uuid.v4();
  config.services.push('sauce');
  config = Object.assign({}, config, {
    sauceConnect: true,
    sauceConnectOpts: {
      noSslBumpDomains: 'all',
      tunnelDomains: [
        '127.0.0.1',
        'localhost'
      ],
      tunnelIdentifier: tunnelId,
      port: process.env.SAUCE_CONNECT_PORT || 4445
    }
  });
}
else {
  config.services = ['sauce'];
  config.sauceConnect = false;
}

config.mochaOpts.timeout = 120000;

// Setup Sauce Labs extended debugging
Object.keys(config.capabilities)
  .forEach((c) => {
    config.capabilities[c].desiredCapabilities.extendedDebugging = true;
  });

config = Object.assign({}, config, {
  deprecationWarnings: false, // Deprecation warnings on sauce just make the logs noisy
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY
});


exports.config = config;
