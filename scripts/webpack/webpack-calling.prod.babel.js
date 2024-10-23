/**
 * Webpack config for building individual packages for distribution
 */
/* eslint no-sync:0 */

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpackBaseConfig = require('./webpack.base.babel');

const plugins = [
  new webpack.IgnorePlugin({
    resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/
  })
];

// Bundle paths are used for demos only
let scriptBundle, styleBundle;

if (process.env.BUILD_BUNDLE_PUBLIC_PATH) {
  scriptBundle = `<script src="${process.env.BUILD_BUNDLE_PUBLIC_PATH}bundle.js"></script>`;
  styleBundle = `<link rel="stylesheet" href="${process.env.BUILD_BUNDLE_PUBLIC_PATH}main.css">`;
}

console.log('process.env.BUILD_BUNDLE_PUBLIC_PATH:',process.env.BUILD_BUNDLE_PUBLIC_PATH)

// Only create html file when one exists in src/
if (fs.existsSync('./src/index.html')) {
  plugins.push(
    new HtmlWebpackPlugin({
      hash: true,
      minify: {
        collapseWhitespace: false,
        removeComments: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        sortAttributes: true,
        sortClassName: true
      },
      template: './index.html',
      bundlePaths: {
        scriptBundle,
        styleBundle
      }
    })
  );
}

const publicPath = process.env.BUILD_PUBLIC_PATH || '/';

// env config object from command line: https://webpack.js.org/guides/environment-variables/
module.exports = (env) => webpackBaseConfig({
  mode: 'production',
  entry: './index.ts',
  output: {
    filename: 'bundle.js',
    path: process.env.BUILD_DIST_PATH || path.resolve(process.cwd(), 'dist'),
    sourceMapFilename: '[file].map',
    publicPath
  },
  // Full source maps for production debugging
  devtool: 'source-map',
  plugins,
  // Reset env values we don't want to see in bundles
  env: {
    WEBEX_ACCESS_TOKEN: '',
    TO_PERSON_EMAIL: '',
    TO_PERSON_ID: ''
  }
}, env);
