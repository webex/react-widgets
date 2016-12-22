import webpack from 'webpack';

import webpackBaseConfig from './webpack.base.babel';

const plugins = [
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
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
    presets: [`react`, `es2015`]
  }
});

export default config;
