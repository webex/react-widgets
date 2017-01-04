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
  devtools: `cheap-module-eval-source-map`,
  babelInclude: [
    path.resolve(__dirname, `packages`, `node_modules`)
  ]
});
