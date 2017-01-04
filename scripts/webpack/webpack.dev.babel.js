/**
 * In development we assume that the code generated is going to be consumed by
 * webpack dev server and we are bundling into a single js file.
 */

import path from 'path';
import webpackConfigBase from './webpack.base.babel';
import HtmlWebpackPlugin from 'html-webpack-plugin';


const plugins = [
  new HtmlWebpackPlugin({
    template: `index.html`
  })
];

export default webpackConfigBase({
  entry: `./demo.js`,
  plugins,
  devtool: `eval-source-map`,
  devServer: {
    port: 8000,
    stats: {
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: false,
      errorDetails: false,
      warnings: false,
      publicPath: false
    }
  },
  babelInclude: [
    path.resolve(__dirname, `packages`, `node_modules`)
  ]
});
