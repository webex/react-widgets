/* global browser */
require('dotenv').config();
require('babel-register');

const os = require('os');
const fs = require('fs');
const path = require('path');

const mkdirp = require('mkdirp');

// eslint-disable-next-line prefer-destructuring
const argv = require('yargs').argv;

const {inject} = require('../scripts/utils/tests/openh264');

const browserType = process.env.BROWSER || 'chrome';
const platform = process.env.PLATFORM || 'mac 10.12';
const port = process.env.PORT || 4567;
const suite = argv.suite || 'integration';
const logPath = './reports/';

const SELENIUM_VERSION = '3.4.0';
const build = process.env.BUILD_NUMBER || `local-${process.env.USER}-wdio-${Date.now()}`;
const baseUrl = process.env.JOURNEY_TEST_BASE_URL || `http://localhost:${port}`;

const chromeCapabilities = {
  browserName: 'chrome',
  name: `react-widget-${suite}`,
  build,
  logLevel: 'WARN',
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
  seleniumVersion: SELENIUM_VERSION,
  platform
};

const firefoxCapabilities = {
  browserName: 'firefox',
  name: `react-widget-${suite}`,
  build,
  logLevel: 'WARN',
  idleTimeout: 300,
  maxDuration: 3600,
  seleniumVersion: SELENIUM_VERSION,
  platform
};

let browserCapabilities;

if (browserType.toLowerCase().includes('chrome')) {
  browserCapabilities = {
    browserLocal: {
      desiredCapabilities: chromeCapabilities
    },
    browserRemote: {
      desiredCapabilities: chromeCapabilities
    }
  };
}
else if (browserType.toLowerCase().includes('firefox')) {
  browserCapabilities = {
    browserLocal: {
      desiredCapabilities: firefoxCapabilities
    },
    browserRemote: {
      desiredCapabilities: firefoxCapabilities
    }
  };
}

let mochaTimeout = 30000;

if (process.env.DEBUG_JOURNEYS) {
  mochaTimeout = 99999999;
}

function saveBrowserLogs(browser, details) {
  if (browserType !== 'firefox') {
    const logTypes = browser.logTypes();

    Object.keys(logTypes).forEach((browserId) => {
      if (logTypes[browserId].value.includes('browser')) {
        const logs = browser.select(browserId).log('browser');

        if (logs.value.length) {
          const json = Object.assign({}, logs, {details});
          const jsonString = `${JSON.stringify(json, null, 2)}\n`;
          const dir = path.resolve(process.cwd(), logPath, 'browser', suite);
          mkdirp(dir, (err) => {
            if (err) {
              console.error(err);
            }
            else {
              const {timestamp} = logs.value[0];
              fs.writeFileSync(path.resolve(dir, `${details.type}-${browserId}-${timestamp}.json`), jsonString, 'utf8');
            }
          });
        }
      }
    });
  }
}

exports.config = {
  seleniumInstallArgs: {version: SELENIUM_VERSION},
  seleniumArgs: {version: SELENIUM_VERSION},
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
  build,
  capabilities: browserCapabilities,
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
  logLevel: 'error',
  //
  // Enables colors for log output.
  coloredLogs: true,
  //
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  //
  // Saves a screenshot to a given path if a command fails.
  screenshotPath: `${logPath}/error-screenshots/`,
  screenshotOnReject: true,
  //
  // Set a base URL in order to shorten url command calls. If your url parameter starts
  // with "/", then the base url gets prepended.
  baseUrl,
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
  services: [
    'firefox-profile',
    'selenium-standalone',
    'static-server'
  ],
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
      outputDir: `${logPath}/junit/wdio/`,
      outputFileFormat: {
        multi(opts) {
          return `${suite}-${browserType}-${platform}-${opts.cid}.xml`;
        }
      },
      packageName: `${suite}-${browserType}-${platform}`
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
  beforeSuite() {
    // Setup test user scopes
    process.env.CISCOSPARK_SCOPE = [
      'webexsquare:get_conversation',
      'spark:people_read',
      'spark:rooms_read',
      'spark:rooms_write',
      'spark:memberships_read',
      'spark:memberships_write',
      'spark:messages_read',
      'spark:messages_write',
      'spark:teams_read',
      'spark:teams_write',
      'spark:team_memberships_read',
      'spark:team_memberships_write',
      'spark:kms'
    ].join(' ');
  },
  onPrepare(conf, capabilities) {
    const defs = [
      capabilities.browserRemote.desiredCapabilities,
      capabilities.browserLocal.desiredCapabilities
    ];

    /* eslint-disable no-param-reassign */
    defs.forEach((d) => {
      if (process.env.SAUCE) {
        d.build = build;
        d.version = d.version || 'latest';
        d.platform = d.platform || 'OS X 10.12';
      }
      else {
        d.platform = os.platform();
      }
    });
    /* eslint-enable no-param-reassign */

    return inject(defs);
  },
  afterTest(test) {
    saveBrowserLogs(browser, test);
  },
  afterSuite(suiteDetails) {
    saveBrowserLogs(browser, suiteDetails);
  },
  // Static Server setup
  staticServerFolders: [
    {mount: '/dist-space', path: './packages/node_modules/@ciscospark/widget-space/dist'},
    {mount: '/dist-recents', path: './packages/node_modules/@ciscospark/widget-recents/dist'},
    {mount: '/', path: './test/journeys/server/'},
    {mount: '/axe-core', path: './node_modules/axe-core/'}
  ],
  staticServerPort: port
};
