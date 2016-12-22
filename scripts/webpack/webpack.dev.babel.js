import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpackConfigBase from './webpack.base.babel';

const plugins = [
  // new HtmlWebpackPlugin({
  //   template: `index.html`
  // })
];

export default (options) => webpackConfigBase(Object.assign({
  entry: `./index.js`,
  output: {
    filename: `bundle.js`,
    chunkFilename: `bundle.chunk.js`
  },
  plugins,
  devtools: `cheap-module-eval-source-map`
}, options));
