import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import InlineEnviromentVariablesPlugin from 'inline-environment-variables-webpack-plugin';

import cssnext from 'postcss-cssnext';

export default (options) => ({
  context: path.resolve(`src`),
  entry: options.entry,
  output: Object.assign({
    filename: `bundle.js`,
    path: path.resolve(`dist`),
    sourceMapFilename: `[file].map`
  }, options.output),
  devtool: options.devtool,
  plugins: options.plugins.concat([
    new InlineEnviromentVariablesPlugin(Object.assign(process.env, options.env)),
    new ExtractTextPlugin(`[name].css`),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]),
  stats: {
    children: false
  },
  target: `web`,
  resolve: {
    extensions: [`.js`]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules|dist/,
        use: [{
          loader: `babel-loader`,
          options: options.babelQuery
        }]
      },
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          ExtractTextPlugin.extract({
            fallbackLoader: `style-loader`,
            loader: [{
              loader: `css-loader`,
              options: {
                camelCase: true,
                modules: true,
                localIdentName: `[local]--[hash:base64:5]`,
                importLoaders: 1
              }
            }, {
              loader: `postcss-loader`
            }]
          }), {
            loader: `postcss-loader`,
            options: {
              plugins: [
                cssnext({
                  browsers: [`last 2 versions`, `IE > 10`]
                })
              ]
            }
          }
        ]
      },
      {
        // Do not transform vendor`s CSS with CSS-modules
        test: /\.css$/,
        include: [/node_modules/],
        loaders: [`style-loader`, `css-loader`]
      },
      {
        test: /\.json$/,
        loader: `json-loader`
      },
      {
        test: /\.woff$/,
        // Inline small woff files and output them below font/.
        // Set mimetype just in case.
        loader: `file-loader`,
        query: {
          name: `fonts/[hash].[ext]`,
          mimetype: `application/font-woff`
        }
      },
      {
        test: /\.ttf$|\.otf$|\.eot$|\.svg$/,
        loader: `file-loader`,
        query: {
          name: `fonts/[hash].[ext]`
        }
      },
      {
        test: /.*\.(gif|png|jpg)$/,
        loaders: [
          `file?name=[name].[ext]`,
          `image-webpack?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}`
        ]
      }
    ]
  },
  node: {
    fs: `empty`
  }
});
