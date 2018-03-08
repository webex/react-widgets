require('dotenv').config();
require('babel-register');

const os = require('os');

// eslint-disable-next-line prefer-destructuring
const argv = require('yargs').argv;

const {inject} = require('../scripts/tests/openh264');
const beforeSuite = require('../scripts/tests/beforeSuite');

const browser = process.env.BROWSER || 'chrome';
const platform = process.env.PLATFORM || 'mac 10.12';
const port = process.env.PORT || 4567;
const suite = argv.suite || 'integration';

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

exports.config = {
  seleniumInstallArgs: {version: '3.4.0'},
  seleniumArgs: {version: '3.4.0'},
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
  baseUrl: process.env.JOURNEY_TEST_BASE_URL || `http://localhost:${port}`,
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
  onPrepare(conf, capabilities) {
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
