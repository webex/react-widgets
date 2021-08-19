require('@babel/register');
const os = require('os');

const dotenv = require('dotenv');

dotenv.config();
dotenv.config({path: '.env.default'});

// eslint-disable-next-line prefer-destructuring
const argv = require('yargs').argv;

const uuid = require('uuid');

const beforeSuite = require('./scripts/tests/beforeSuite');

const port = process.env.PORT || 4567;
const isSauceEnabled = (process.env.SAUCE === 'true');
let baseUrl = process.env.JOURNEY_TEST_BASE_URL;

if (!baseUrl) {
  baseUrl = process.env.TAP ? 'https://code.s4d.io' : `http://localhost:${port}`;
}
const browser = process.env.BROWSER || 'chrome';
const browserVersion = process.env.VERSION || 'latest';
const platformName = process.env.PLATFORM || 'macOS 11';
const build = process.env.BUILD_NUMBER || `local-${process.env.USER}-wdio-${Date.now()}`;

process.env.BUILD_NUMBER = build;
const tunnelId = uuid.v4();
const suite = argv.suite || 'smoke';
const screenResolutionMac = '2048x1536';
const screenResolutionWin = '1920x1080';
const screenResolution = platformName.toLowerCase().includes('os x') || platformName === 'darwin' || platformName.includes('mac') ? screenResolutionMac : screenResolutionWin;

const chromeCapabilities = {
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: [
      '--use-fake-device-for-media-stream',
      '--use-fake-ui-for-media-stream',
      '--disable-infobars'
    ],
    prefs: {
      'profile.default_content_setting_values.notifications': 2
    }
  }
};
const firefoxCapabilities = {
  browserName: 'firefox',
  'moz:firefoxOptions': {
    prefs: {
      'dom.webnotifications.enabled': false,
      'media.webrtc.hw.h264.enabled': true,
      'media.getusermedia.screensharing.enabled': true,
      'media.navigator.permission.disabled': true,
      'media.navigator.streams.fake': true,
      'media.peerconnection.video.h264_enabled': true
    }
  }
};

const sauceCapabilities = (remoteName) => {
  if (remoteName === 'chrome') {
    return Object.assign({}, chromeCapabilities, {
      platformName,
      browserVersion,
      'sauce:options': {
        build,
        idleTimeout: 300,
        commandTimeout: 600,
        maxDuration: 3600,
        extendedDebugging: true,
        screenResolution
      }
    });
  }

  return Object.assign({}, firefoxCapabilities, {
    platformName,
    browserVersion,
    'moz:firefoxOptions': {
      args: [
        '-start-debugger-server',
        '9222'
      ],
      prefs: {
        'devtools.chrome.enabled': true,
        'devtools.debugger.prompt-connection': false,
        'devtools.debugger.remote-enabled': true,
        'dom.webnotifications.enabled': false,
        'media.webrtc.hw.h264.enabled': true,
        'media.getusermedia.screensharing.enabled': true,
        'media.navigator.permission.disabled': true,
        'media.navigator.streams.fake': true,
        'media.peerconnection.video.h264_enabled': true
      }
    },
    'sauce:options': {
      build,
      idleTimeout: 300,
      commandTimeout: 600,
      maxDuration: 3600,
      extendedDebugging: true,
      screenResolution
    }
  });
};

let mochaTimeout = 30000;

if (process.env.DEBUG_JOURNEYS) {
  mochaTimeout = 99999999;
}
if (isSauceEnabled) {
  mochaTimeout = 60000;
}
const services = ['intercept'];

if (isSauceEnabled) {
  services.push(['sauce', {
    deprecationWarnings: false, // Deprecation warnings on sauce just make the logs noisy
    build: process.env.BUILD_NUMBER,
    sauceConnect: !process.env.TAP,
    sauceConnectOpts: {
      noSslBumpDomains: [
        'idbroker.webex.com',
        'idbrokerbts.webex.com',
        '127.0.0.1',
        'localhost',
        '*.wbx2.com',
        '*.ciscospark.com'
      ],
      tunnelDomains: [
        '127.0.0.1',
        'localhost'
      ],
      tunnelIdentifier: tunnelId
    }
  }]);
}
else {
  services.push(['selenium-standalone']);
}
if (!process.env.TAP) {
  services.push(['static-server', {
    port,
    folders: [
      {mount: '/dist-space', path: './packages/node_modules/@webex/widget-space/dist'},
      {mount: '/dist-recents', path: './packages/node_modules/@webex/widget-recents/dist'},
      {mount: '/dist-demo', path: './packages/node_modules/@webex/widget-demo/dist'},
      {mount: '/', path: './test/journeys/server/'},
      {mount: '/axe-core', path: './node_modules/axe-core/'},
      ...(process.env.STATIC_SERVER_PATH
        ? [{mount: '/', path: process.env.STATIC_SERVER_PATH}]
        : [])
    ]
  }]);
}

exports.config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  //
  // WebdriverIO allows it to run your tests in arbitrary locations (e.g. locally or
  // on a remote machine).
  runner: 'local',
  //
  // =================
  // Service Providers
  // =================
  // WebdriverIO supports Sauce Labs, Browserstack, Testing Bot and LambdaTest (other cloud providers
  // should work too though). These services define specific user and key (or access key)
  // values you need to put in here in order to connect to these services.
  //
  user: process.env.SAUCE_USERNAME,
  key: process.env.SAUCE_ACCESS_KEY,
  //
  // If you run your tests on Sauce Labs you can specify the region you want to run your tests
  // in via the `region` property. Available short handles for regions are `us` (default) and `eu`.
  // These regions are used for the Sauce Labs VM cloud and the Sauce Labs Real Device Cloud.
  // If you don't provide the region it will default for the `us`
  region: 'us',
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
    smoke: [
      [
        './test/journeys/specs/smoke/widget-space/index.js',
        './test/journeys/specs/smoke/widget-recents/index.js',
        './test/journeys/specs/smoke/multiple/index.js',
        './test/journeys/specs/smoke/demo.js'
      ]
    ],
    tap: [
      './test/journeys/specs/tap/**/*.js'
    ],
    space: [
      [
        './test/journeys/specs/space/index.js',
        './test/journeys/specs/space/guest.js',
        './test/journeys/specs/space/startup-settings.js',
        './test/journeys/specs/space/data-api.js'
      ]
    ],
    recents: [
      [
        './test/journeys/specs/recents/dataApi/basic.js',
        './test/journeys/specs/recents/global/basic.js',
        './test/journeys/specs/recents/dataApi/space-list-filter.js',
        './test/journeys/specs/recents/global/space-list-filter.js',
        './test/journeys/specs/recents/global/startup-settings.js'
      ]
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
  maxInstances: 1,
  //
  // If you have trouble getting all important capabilities together, check out the
  // Sauce Labs platform configurator - a great tool to configure your capabilities:
  // https://docs.saucelabs.com/reference/platforms-configurator
  capabilities: browser === 'chrome' ? {
    browserLocal: {
      capabilities: isSauceEnabled ? sauceCapabilities('chrome') : chromeCapabilities
    },
    browserRemote: {
      capabilities: isSauceEnabled ? sauceCapabilities('chrome') : chromeCapabilities
    }
  } : {
    browserLocal: {
      capabilities: isSauceEnabled ? sauceCapabilities('firefox') : firefoxCapabilities
    },
    browserRemote: {
      capabilities: isSauceEnabled ? sauceCapabilities('firefox') : firefoxCapabilities
    }
  },
  //
  // ===================
  // Test Configurations
  // ===================
  // Define all options that are relevant for the WebdriverIO instance here
  //
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
  // screenshotPath: './errorShots/',
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
  // connectionRetryTimeout: 90000,
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
  reporters: [
    'spec',
    ['junit', {
      outputDir: './reports/junit/wdio/',
      outputFileFormat() {
        return `results-${suite}-${browser}-${platformName}.xml`;
      },
      packageName: `${suite}-${browser}-${platformName}`
    }]
  ],

  //
  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: mochaTimeout
    // Retries here causes tests to become even more flaky and 100x slower
    // than retrying flaky tests individually
    // retries: 3
  },

  // =====
  // Hooks
  // =====
  beforeSuite,

  onPrepare(config, capabilities) {
    const defs = [
      capabilities.browserRemote.capabilities,
      capabilities.browserLocal.capabilities
    ];

    /* eslint-disable no-param-reassign */
    defs.forEach((d) => {
      if (isSauceEnabled) {
        d.browserVersion = d.browserVersion || 'latest';
        d.platformName = d.platformName || 'macOS 11';
      }
      else {
        // Copy the base over so that inject() does its thing.
        d.platformName = () => {
          switch (os.type()) {
            case 'Darwin':
              return 'mac';
            case 'Window_NT':
              return 'windows';
            case 'Linux':
              return 'Linux';
            default:
              return os.type();
          }
        };
      }
    });
  }
};
