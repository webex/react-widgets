import path from 'path';
import webpackConfigBase from './webpack.base.babel';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import postcssReporter from 'postcss-reporter';


const plugins = [
  new HtmlWebpackPlugin({
    template: `index.html`
  })
];

export default webpackConfigBase({
  entry: `./index.js`,
  plugins,
  devtools: `cheap-module-eval-source-map`,
  postcss: [postcssReporter],
  babelInclude: [
    path.resolve(__dirname, `packages`, `node_modules`)
  ]
});
