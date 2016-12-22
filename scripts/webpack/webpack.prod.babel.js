import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import webpackBaseConfig from './webpack.base.babel';

const plugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  // new HtmlWebpackPlugin({
  //   hash: true,
  //   minify: {
  //     collapseWhitespace: false,
  //     removeComments: true,
  //     removeScriptTypeAttributes: true,
  //     removeStyleLinkTypeAttributes: true,
  //     sortAttributes: true,
  //     sortClassName: true
  //   },
  //   template: path.resolve(__dirname, `..`, `src/index.html`)
  // })
];

const config = webpackBaseConfig({
  entry: `./index.js`,
  devtool: `source-map`,
  plugins,
  env: {
    CISCOSPARK_ACCESS_TOKEN: ``,
    TO_PERSON_EMAIL: ``,
    TO_PERSON_ID: ``
  },
  babelQuery: {
    cacheDirectory: true,
    presets: [`react`, `es2015`]
  }
});

export default config;
