require('dotenv').config();

const uuid = require('uuid');

process.env.SAUCE = true;

let {config} = require('./wdio.conf.js');

if (process.env.SAUCE_CONNECT) {
  const tunnelId = uuid.v4();
  config.services.push('sauce');
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
