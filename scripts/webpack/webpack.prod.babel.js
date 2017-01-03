import path from 'path';
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
  context: path.resolve(`./src`),
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
console.log(`STUPID`);
console.log(__dirname);
export default config;
