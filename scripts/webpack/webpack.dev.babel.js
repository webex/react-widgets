import path from 'path';
import webpackConfigBase from './webpack.base.babel';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import postcssReporter from 'postcss-reporter';


const plugins = [
  new HtmlWebpackPlugin({
    template: `index.html`
  })
];

export default (options) => webpackConfigBase(Object.assign({
  entry: `./index.js`,
  plugins,
  devtools: `cheap-module-eval-source-map`,
  postcss: [postcssReporter],
  babelQuery: {
    presets: [`es2015`, `react`]
  },
  babelInclude: [
    path.resolve(__dirname, `packages`, `node_modules`)
  ]
}, options));
