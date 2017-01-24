import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import dotenv from 'dotenv';

dotenv.config();

export default (options) => {
  const packageJson = require(`../../package.json`);
  const plugins = [
    new webpack.EnvironmentPlugin([
      `NODE_ENV`
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
      colors: true
    },
    target: `web`,
    resolve: {
      modules: [
        `src`,
        path.resolve(__dirname, `..`, `..`, `packages`, `node_modules`),
        `node_modules`
      ],
      extensions: [`.js`, `.css`, `.json`]
    },
    module: {
      loaders: [
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, `..`, `..`, `packages`, `node_modules`),
            path.resolve(__dirname, `..`, `..`, `src`)
          ],
          exclude: [
            `/fixtures/`,
            `/__mocks__/`
          ],
          loader: `babel-loader`
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, `..`, `..`, `packages`, `node_modules`),
            path.resolve(__dirname, `..`, `..`, `src`)
          ],
          loader: ExtractTextPlugin.extract({
            loader: [{
              loader: `css-loader`,
              query: {
                camelCase: true,
                modules: true,
                localIdentName: `[local]--[hash:base64:5]`,
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: `postcss-loader`,
              query: {
                sourceMap: true
              }
            }]
          })
        },
        {
          // Do not transform vendor`s CSS with CSS-modules
          test: /\.css$/,
          include: [path.resolve(__dirname, `..`, `..`, `node_modules`)],
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
            name: `fonts/[name].[ext]`,
            mimetype: `application/font-woff`
          }
        },
        {
          test: /\.ttf$|\.otf$|\.eot$|\.svg$/,
          loader: `file-loader`,
          query: {
            name: `fonts/[name].[ext]`
          }
        },
        {
          test: /.*\.(gif|png|jpg)$/,
          loaders: [
            `file-loader?name=[name].[ext]`,
            `image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}`
          ]
        }
      ]
    },
    node: {
      fs: `empty`
    }
  };
};
