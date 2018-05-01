require('dotenv').config();

const uuid = require('uuid');

const {inject} = require('../scripts/utils/tests/openh264');

process.env.SAUCE = true;

let {config} = require('./wdio.conf.js');

// If we haven't deployed to netlify force sauce connect
if (!process.env.JOURNEY_TEST_BASE_URL) {
  process.env.SAUCE_CONNECT = true;
}

if (process.env.SAUCE_CONNECT) {
  const tunnelId = uuid.v4();
  config.services.push('sauce');
  config = Object.assign({}, config, {
    sauceConnect: true,
    sauceConnectOpts: {
      noSslBumpDomains: ['all'],
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


exports.config = Object.assign({}, config, {
  deprecationWarnings: false, // Deprecation warnings on sauce just make the logs noisy
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  seleniumArgs: {},
  seleniumInstallArgs: {},
  logOutput: './reports/wdio/',
  onPrepare(conf, caps) {
    const defs = Object.keys(caps).map((c) => caps[c].desiredCapabilities);
    /* eslint-disable no-param-reassign */
    defs.forEach((d) => {
      d.build = process.env.BUILD_NUMBER || `local-${process.env.USER}-wdio-${Date.now()}`;
      d.version = d.version || 'latest';
      d.platform = d.platform.toLowerCase().includes('mac') || d.platform === 'darwin' ? 'macOS 10.12' : d.platform;
    });
    /* eslint-enable no-param-reassign */
    return inject(defs)
      .then(() => {
        // Remove the base because it's not actually a selenium property
        defs.forEach((d) => Reflect.deleteProperty(d, 'base'));
      });
  }
});
