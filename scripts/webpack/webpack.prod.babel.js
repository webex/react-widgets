/**
 * Webpack config for building individual packages for distribution
 */

import path from 'path';
import webpack from 'webpack';

import webpackBaseConfig from './webpack.base.babel';

const plugins = [
  // Setup uglify to compress and suppress warnings in logs
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  // Remove locales from moment, may need to add back in future
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
];

export default webpackBaseConfig({
  entry: `./index.js`,
  output: {
    filename: `bundle.js`,
    path: path.resolve(process.cwd(), `dist`),
    sourceMapFilename: `[file].map`
  },
  // Full source maps for production debugging
  devtool: `source-map`,
  plugins,
  // Reset env values we don't want to see in bundles
  env: {
    CISCOSPARK_ACCESS_TOKEN: ``,
    TO_PERSON_EMAIL: ``,
    TO_PERSON_ID: ``
  }
});
