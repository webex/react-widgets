/* eslint-disable global-require */
require('dotenv').config();

let config;
if (process.env.SAUCE) {
  ({config} = require('./wdio.sauce.conf.js'));
}
else {
  ({config} = require('./wdio.conf.js'));
}

config.baseUrl = 'https://code.s4d.io';
config.sauceConnect = false;

config.suites = {
  tap: [
    './test/journeys/specs/tap/**/*.js'
  ],
  'tap-recents': ['./test/journeys/specs/tap/widget-recents/index.js'],
  'tap-oneOnOne': ['./test/journeys/specs/tap/widget-space/oneOnOne.js'],
  'tap-space': ['./test/journeys/specs/tap/widget-space/space.js']
};

exports.config = config;
