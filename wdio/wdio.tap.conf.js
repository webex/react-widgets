require('dotenv').config();

const {config} = require('./wdio.sauce.conf.js');

config.baseUrl = 'https://code.s4d.io';
config.sauceConnect = false;

config.suites = {
  tap: [
    './test/journeys/specs/tap/**/*.js'
  ]
};

exports.config = config;
