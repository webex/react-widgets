/**
 * Webpack config for building individual packages for distribution
 */
/* eslint no-sync:0 */

import path from 'path';
import fs from 'fs';

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import webpackBaseConfig from './webpack.base.babel';

const plugins = [
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];

// Bundle paths are used for demos only
let scriptBundle, styleBundle;
if (process.env.BUILD_BUNDLE_PUBLIC_PATH) {
  scriptBundle = `<script src="${process.env.BUILD_BUNDLE_PUBLIC_PATH}bundle.js"></script>`;
  styleBundle = `<link rel="stylesheet" href="${process.env.BUILD_BUNDLE_PUBLIC_PATH}main.css">`;
}

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

const publicPath = process.env.BUILD_PUBLIC_PATH;

// env config object from command line: https://webpack.js.org/guides/environment-variables/
export default (env) => webpackBaseConfig({
  mode: 'production',
  entry: './index.js',
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
    CISCOSPARK_ACCESS_TOKEN: '',
    TO_PERSON_EMAIL: '',
    TO_PERSON_ID: ''
  }
}, env);
