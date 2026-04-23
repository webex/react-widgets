/**
 * In development we assume that the code generated is going to be consumed by
 * webpack dev server and we are bundling into a single js file.
 */

const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackConfigBase = require('./webpack.base.babel');

const plugins = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    bundlePaths: {
      scriptBundle: '<!-- Script should be in main bundle -->',
      styleBundle: '<!-- Style should be in main bundle -->'
    }
  }),
  new webpack.EnvironmentPlugin([
    'WEBEX_ACCESS_TOKEN',
    'WEBEX_CLIENT_ID',
    'SPACE_ID',
    'TO_PERSON_EMAIL',
    'TO_PERSON_ID'
  ])
];

// Configure HTTPS with custom certs or fallback to self-signed
const certPath = path.resolve(__dirname, '../../.cert');
const keyPath = path.join(certPath, 'key.pem');
const certFilePath = path.join(certPath, 'cert.pem');

let httpsConfig;
let devHost;
let devPort;
let publicHost;

if (fs.existsSync(keyPath) && fs.existsSync(certFilePath)) {
  httpsConfig = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certFilePath)
  };
  devHost = 'local-dev.cisco.com';
  devPort = process.env.PORT || 8000;
  publicHost = `local-dev.cisco.com:${devPort}`;
}
else {
  httpsConfig = true;
  devHost = 'localhost';
  devPort = process.env.PORT || 8000;
  publicHost = `localhost:${devPort}`;
}

// env config object from command line: https://webpack.js.org/guides/environment-variables/
module.exports = (env) => webpackConfigBase({
  entry: './index.js',
  mode: 'development',
  plugins,
  devtool: 'source-map',
  devServer: {
    host: devHost,
    port: devPort,
    disableHostCheck: true,
    https: httpsConfig,
    public: publicHost,
    proxy: {
      '/v1': {
        target: 'https://api.ciscospark.com',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
      'Permissions-Policy': 'camera=*, microphone=*, display-capture=*',
      'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.s4d.io; "
        + "style-src 'self' 'unsafe-inline' https://code.s4d.io; "
        + "media-src 'self' https://code.s4d.io https://*.clouddrive.com https://*.giphy.com https://*.webexcontent.com data: blob:; "
        + "font-src 'self' https://code.s4d.io; "
        + "img-src 'self' https://*.clouddrive.com https://code.s4d.io https://*.webexcontent.com data: blob: https://*.rackcdn.com https://cisco.webex.com; "
        + `connect-src 'self' localhost local-dev.cisco.com ws://localhost:${devPort} ws://local-dev.cisco.com:${devPort} wss://*.ciscospark.com wss://*.wbx.com wss://*.wbx2.com https://*.ciscospark.com https://*.clouddrive.com/ https://code.s4d.io https://*.giphy.com https://*.wbx2.com https://*.webex.com https://*.webexcontent.com https://*.cisco.com https://myspark.cisco.com https://webexapis.com;`
    },
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: true,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false
    }
  }
}, env);
