import webpackConfigBase from './webpack.base.babel';

const plugins = [
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
