require('dotenv').config();

const config = require('./wdio.sauce.conf.js');

config.baseUrl = 'https://code.s4d.io';
config.sauceConnect = false;

exports.config = config;
