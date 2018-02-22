require('dotenv').config();
require('babel-register');

const os = require('os');

// eslint-disable-next-line prefer-destructuring
const argv = require('yargs').argv;

const uuid = require('uuid');

const {inject} = require('./scripts/tests/openh264');
const beforeSuite = require('./scripts/tests/beforeSuite');


const browser = process.env.BROWSER || 'chrome';
const platform = process.env.PLATFORM || 'OS X 10.12';
const tunnelId = uuid.v4();
const port = process.env.PORT || 4567;
const {suite} = argv || 'all';

const chromeCapabilities = {
  browserName: 'chrome',
  name: `react-widget-${suite}`,
  chromeOptions: {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      '--disable-infobars'
    ],
    prefs: {
      'profile.default_content_setting_values.notifications': 2
    }
  },
  idleTimeout: 300,
  maxDuration: 3600,
  seleniumVersion: '3.4.0',
  platform
};
const firefoxCapabilities = {
  browserName: 'firefox',
  name: `react-widget-${suite}`,
  idleTimeout: 300,
  maxDuration: 3600,
  seleniumVersion: '3.4.0',
  platform
};
let mochaTimeout = 30000;

if (process.env.DEBUG_JOURNEYS) {
  mochaTimeout = 99999999;
}
if (process.env.SAUCE) {
  mochaTimeout = 90000;
}
const services = [];
services.push('firefox-profile');
if (process.env.SAUCE) {
  services.push('sauce');
}
else {
  services.push('selenium-standalone');
}
if (!process.env.TAP) {
  services.push('static-server');
}

exports.config = {
  seleniumInstallArgs: {version: '3.4.0'},
  seleniumArgs: {version: '3.4.0'},
  //
  // ==================
  // Specify Test Files
  // ==================
  // Define which test specs should run. The pattern is relative to the directory
  // from which `wdio` was called. Notice that, if you are calling `wdio` from an
  // NPM script (see https://docs.npmjs.com/cli/run-script) then the current working
  // directory is where your package.json resides, so `wdio` will be called from there.
  //
  specs: ['./test/journeys/specs/**/*.js'],
  suites: {
    tap: [
      './test/journeys/specs/tap/**/*.js'
    ],
    oneOnOne: [
      './test/journeys/specs/oneOnOne/**/*.js'
    ],
    space: [
      './test/journeys/specs/space/**/*.js'
    ],
    recents: [
      './test/journeys/specs/recents/**/*.js'
    ],
    multiple: [
      './test/journeys/specs/multiple/**/*.js'
    ]
  },
  // Patterns to exclude.
  exclude: [],
  //
  // ============
  // Capabilities
  // ============
  // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
  // time. Depending on the number of capabilities, WebdriverIO launches several test
  // sessions. Within your capabilities you can overwrite the spec and exclude options in
  // order to group specific specs to a specific capability.
  //
  // First, you can define how many instances should be started at the same time. Let's
  // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
  // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
  // files and you set maxInstances to 10, all spec files will get tested at the same time
  // and 30 processes will get spawned. The property handles how many capabilities
  // from the same test should run tests.
  //
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  //
  capabilities: browser === 'chrome' ? {
    browserLocal: {
      desiredCapabilities: chromeCapabilities
    },
    browserRemote: {
      desiredCapabilities: chromeCapabilities
    }
  } : {
    browserLocal: {
      desiredCapabilities: firefoxCapabilities
    },
    browserRemote: {
      desiredCapabilities: firefoxCapabilities
    }
  },
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
  // By default WebdriverIO commands are executed in a synchronous way using
  // the wdio-sync package. If you still want to run your tests in an async way
  // e.g. using promises you can set the sync option to false.
  sync: true,
  //
  // Level of logging verbosity: silent | verbose | command | data | result | error
  logLevel: 'silent',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  // screenshotPath: './errorShots/',
  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", then the base url gets prepended.
  baseUrl: process.env.TAP ? 'https://code.s4d.io' : `http://localhost:${port}`,
  //
  // Default timeout for all waitFor* commands.
  waitforTimeout: 30000,
  //
  // Default timeout in milliseconds for request
  // if Selenium Grid doesn't send response
  connectionRetryTimeout: 90000,
  //
  // Default request retries count
  connectionRetryCount: 3,
  //
  // Initialize the browser instance with a WebdriverIO plugin. The object should have the
  // plugin name as key and the desired plugin options as properties. Make sure you have
  // the plugin installed before running any tests. The following plugins are currently
  // available:
  // WebdriverCSS: https://github.com/webdriverio/webdrivercss
  // WebdriverRTC: https://github.com/webdriverio/webdriverrtc
  // Browserevent: https://github.com/webdriverio/browserevent
  // plugins: {
  //   webdrivercss: {
  //     screenshotRoot: 'my-shots',
  //     failedComparisonsRoot: 'diffs',
  //     misMatchTolerance: 0.05,
  //     screenWidth: [320,480,640,1024]
  //   },
  //   webdriverrtc: {},
  //   browserevent: {}
  // },
  //
  // Test runner services
  // Services take over a specific job you don't want to take care of. They enhance
  // your test setup with almost no effort. Unlike plugins, they don't add new
  // commands. Instead, they hook themselves up into the test process.
  services,
  //
  // Framework you want to run your specs with.
  // The following are supported: Mocha, Jasmine, and Cucumber
  // see also: http://webdriver.io/guide/testrunner/frameworks.html
  //
  // Make sure you have the wdio adapter package for the specific framework installed
  // before running any tests.
  framework: 'mocha',
  //
  // Test reporter for stdout.
  // The only one supported by default is 'dot'
  // see also: http://webdriver.io/guide/testrunner/reporters.html
  // NOTE: Omitting `xunit` for now. We can revisit that on another pass
  reporters: ['spec', 'junit'],
  reporterOptions: {
    junit: {
      outputDir: './reports/junit/wdio/',
      outputFileFormat() {
        return `results-${suite}-${browser}-${platform}.xml`;
      },
      packageName: `${suite}-${browser}-${platform}`
    }
  },

  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: mochaTimeout
  },

  // =====
  // Hooks
  // =====
  beforeSuite,

  // Static Server setup
  staticServerFolders: [
    {mount: '/dist-space', path: './packages/node_modules/@ciscospark/widget-space/dist'},
    {mount: '/dist-recents', path: './packages/node_modules/@ciscospark/widget-recents/dist'},
    {mount: '/', path: './test/journeys/server/'},
    {mount: '/axe-core', path: './node_modules/axe-core/'}
  ],
  staticServerPort: port,
  onPrepare(config, capabilities) {
    const defs = [
      capabilities.browserRemote.desiredCapabilities,
      capabilities.browserLocal.desiredCapabilities
    ];

    const build = process.env.BUILD_NUMBER || `local-${process.env.USER}-wdio-${Date.now()}`;
    /* eslint-disable no-param-reassign */
    defs.forEach((d) => {
      if (process.env.SAUCE) {
        d.build = build;
        // Set the base to SauceLabs so that inject() does its thing.
        d.base = 'SauceLabs';

        d.version = d.version || 'latest';
        d.platform = d.platform || 'OS X 10.12';
      }
      else {
        // Copy the base over so that inject() does its thing.
        d.base = d.browserName;
        d.platform = os.platform();
      }
    });
    /* eslint-enable no-param-reassign */

    return inject(defs)
      .then(() => {
        // Remove the base because it's not actually a selenium property
        defs.forEach((d) => Reflect.deleteProperty(d, 'base'));
      });
  }
};

if (process.env.SAUCE) {
  exports.config = Object.assign(exports.config, {
    deprecationWarnings: false, // Deprecation warnings on sauce just make the logs noisy
    user: process.env.SAUCE_USERNAME,
    key: process.env.SAUCE_ACCESS_KEY,
    build: process.env.BUILD_NUMBER,
    sauceConnect: !process.env.TAP,
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
