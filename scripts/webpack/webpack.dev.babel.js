/**
 * In development we assume that the code generated is going to be consumed by
 * webpack dev server and we are bundling into a single js file.
 */

import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import webpackConfigBase from './webpack.base.babel';

const plugins = [
  new HtmlWebpackPlugin({
    template: 'index.html',
    bundlePaths: {
      scriptBundle: '<!-- Script should be in main bundle -->',
      styleBundle: '<!-- Style should be in main bundle -->'
    }
  }),
  new webpack.EnvironmentPlugin([
    'CISCOSPARK_ACCESS_TOKEN',
    'MESSAGE_DEMO_CLIENT_ID',
    'MESSAGE_DEMO_CLIENT_SECRET',
    'SPACE_ID',
    'TO_PERSON_EMAIL',
    'TO_PERSON_ID'
  ])
];

export default webpackConfigBase({
  entry: './index.js',
  plugins,
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    port: process.env.PORT || 8000,
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
    },
    headers: {
      'Content-Security-Policy': 'script-src \'self\' \'unsafe-inline\' code.s4d.io; style-src \'self\' \'unsafe-inline\' code.s4d.io; media-src \'self\' code.s4d.io *.clouddrive.com data: blob:; font-src \'self\' code.s4d.io; img-src \'self\' code.s4d.io *.clouddrive.com data: blob: *.rackcdn.com; connect-src \'self\' localhost ws://localhost:8000 wss://*.wbx.com wss://*.wbx2.com ws://*.wbx.com *.wbx2.com *.webex.com code.s4d.io *.ciscospark.com https://*.clouddrive.com/;'
    }
  }
});
