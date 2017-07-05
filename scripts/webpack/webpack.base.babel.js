import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import dotenv from 'dotenv';
import {version} from '../../package.json';
dotenv.config();

process.env.REACT_CISCOSPARK_VERSION = version;

export default (options) => {
  const packageJson = require(`../../package.json`);
  const plugins = [
    new webpack.EnvironmentPlugin([
      `NODE_ENV`,
      `MESSAGE_DEMO_CLIENT_ID`,
      `MESSAGE_DEMO_CLIENT_SECRET`,
      `REACT_CISCOSPARK_VERSION`
    ]),
    new ExtractTextPlugin({filename: `[name].css`, disable: false, allChunks: true}),
    // Adds use strict to prevent catch global namespace issues outside of chunks.
    new webpack.BannerPlugin(`react-ciscospark v${packageJson.version}`)
  ];

  return {
    context: options.context || path.resolve(process.cwd(), `src`),
    entry: options.entry,
    output: Object.assign({
      filename: `bundle.js`,
      path: path.resolve(__dirname, `..`, `..`, `dist`),
      sourceMapFilename: `[file].map`
    }, options.output),
    devtool: options.devtool,
    devServer: options.devServer,
    plugins: options.plugins ? plugins.concat(options.plugins) : plugins,
    stats: {
      children: false,
      chunks: false,
      modules: false,
      maxModules: 0,
      chunkOrigins: false,
      colors: true
    },
    target: `web`,
    resolve: {
      mainFields: [`src`, `browser`, `module`, `main`],
      modules: [
        `src`,
        path.resolve(__dirname, `..`, `..`, `packages`, `node_modules`),
        `node_modules`
      ],
      extensions: [`.js`, `.css`, `.json`]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, `..`, `..`, `packages`, `node_modules`),
            path.resolve(__dirname, `..`, `..`, `src`)
          ],
          exclude: [
            `/__fixtures__/`,
            `/__mocks__/`
          ],
          use: [`babel-loader`]
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, `..`, `..`, `packages`, `node_modules`),
            path.resolve(__dirname, `..`, `..`, `src`)
          ],
          use: ExtractTextPlugin.extract({
            use: [{
              loader: `css-loader`,
              options: {
                camelCase: true,
                modules: true,
                localIdentName: `[local]--[hash:base64:5]`,
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: `postcss-loader`,
              options: {
                sourceMap: true,
                path: path.resolve(__dirname, `postcss.config.js`)
              }
            }]
          })
        },
        {
          // Do not transform vendor`s CSS with CSS-modules
          test: /\.css$/,
          include: [path.resolve(__dirname, `..`, `..`, `node_modules`)],
          use: [`style-loader`, `css-loader`]
        },
        {
          test: /\.woff$/,
          // Inline small woff files and output them below font/.
          // Set mimetype just in case.
          use: [{
            loader: `file-loader`,
            options: {
              name: `fonts/[name].[ext]`,
              mimetype: `application/font-woff`
            }
          }]
        },
        {
          test: /\.ttf$|\.otf$|\.eot$|\.svg$/,
          use: [{
            loader: `file-loader`,
            options: {
              name: `fonts/[name].[ext]`
            }
          }]
        },
        {
          test: /\.mp3$|\.wav$/,
          use: [{
            loader: `file-loader`,
            query: {
              name: `media/[name].[ext]`
            }
          }]
        },
        {
          test: /.*\.(gif|png|jpg)$/,
          use: [
            `file-loader?name=[name].[ext]`
          ]
        }
      ]
    },
    node: {
      fs: `empty`
    }
  };
};
