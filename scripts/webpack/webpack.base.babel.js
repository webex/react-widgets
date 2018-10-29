import path from 'path';

import webpack from 'webpack';
import dotenv from 'dotenv';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import {version} from '../../package.json';

dotenv.config();

process.env.REACT_CISCOSPARK_VERSION = version;

export default (options, env) => {
  const packageJson = require('../../package.json');
  const plugins = [
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'MESSAGE_DEMO_CLIENT_ID',
      'MESSAGE_DEMO_CLIENT_SECRET',
      'REACT_CISCOSPARK_VERSION',
      'WDM_SERVICE_URL',
      'IDBROKER_BASE_URL',
      'CONVERSATION_SERVICE'
    ]),
    new MiniCssExtractPlugin({filename: '[name].css'}),
    // Adds use strict to prevent catch global namespace issues outside of chunks.
    new webpack.BannerPlugin(`react-ciscospark v${packageJson.version}`)
  ];

  return {
    context: options.context || path.resolve(process.cwd(), 'src'),
    mode: options.mode,
    entry: options.entry,
    output: Object.assign({
      filename: 'bundle.js',
      path: path.resolve(__dirname, '..', '..', 'dist'),
      sourceMapFilename: '[file].map'
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
    target: 'web',
    resolve: {
      alias: {
        node_modules: path.resolve(__dirname, '..', '..', 'node_modules')
      },
      mainFields: ['src', 'browser', 'module', 'main'],
      modules: [
        'src',
        path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
        'node_modules'
      ],
      extensions: ['.js', '.css', '.json', '.scss']
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
            path.resolve(__dirname, '..', '..', 'src'),
            path.resolve(__dirname, '..', '..', 'samples')
          ],
          exclude: [
            '/__fixtures__/',
            '/__mocks__/'
          ],
          use: ['babel-loader']
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
            path.resolve(__dirname, '..', '..', 'src')
          ],
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                camelCase: true,
                modules: true,
                localIdentName: `${env && env.package ? env.package : 'widget'}--[local]--[hash:base64:5]`,
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true,
                path: path.resolve(__dirname, 'postcss.config.js')
              }
            }
          ]
        },
        {
          // Do not transform vendor`s CSS with CSS-modules
          test: /\.css$/,
          include: [path.resolve(__dirname, '..', '..', 'node_modules')],
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          include: [
            path.resolve(__dirname, '..', '..', 'packages', 'node_modules'),
            path.resolve(__dirname, '..', '..', 'src'),
            path.resolve(__dirname, '..', '..', 'node_modules')

          ],
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.woff$/,
          // Inline small woff files and output them below font/.
          // Set mimetype just in case.
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              mimetype: 'application/font-woff'
            }
          }]
        },
        {
          test: /\.woff2$/,
          // Inline small woff files and output them below font/.
          // Set mimetype just in case.
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
              mimetype: 'application/font-woff2'
            }
          }]
        },
        {
          test: /\.ttf$|\.otf$|\.eot$|\.svg$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          }]
        },
        {
          test: /\.mp3$|\.wav$/,
          use: [{
            loader: 'file-loader',
            query: {
              name: 'media/[name].[ext]'
            }
          }]
        },
        {
          test: /.*\.(gif|png|jpg)$/,
          use: [
            'file-loader?name=[name].[ext]'
          ]
        }
      ]
    },
    node: {
      fs: 'empty'
    }
  };
};
