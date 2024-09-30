const path = require("path");

const webpack = require("webpack");
const dotenv = require("dotenv");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const postcssPresetEnv = require("postcss-preset-env");

const { version } = require("../../package.json");

dotenv.config();

process.env.REACT_WEBEX_VERSION = version;

module.exports = (options, env) => {
  const packageJson = require("../../package.json");
  const plugins = [
    new webpack.EnvironmentPlugin({
      NODE_ENV: "production",
      REACT_WEBEX_VERSION: "",
      FEDERATION: "",
      IDBROKER_BASE_URL: "",
      U2C_SERVICE_URL: "",
      WEBEX_CLIENT_ID: "",
      WDM_SERVICE_URL: "",
      WEBEX_CONVERSATION_DEFAULT_CLUSTER: "",
      WEBEX_TEST_USERS_CONVERSATION_SERVICE_URL: "",
    }),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    // Adds use strict to prevent catch global namespace issues outside of chunks.
    new webpack.BannerPlugin(`react-widgets v${packageJson.version}`),
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  return {
    context: options.context || path.resolve(process.cwd(), "src"),
    mode: options.mode,
    entry: options.entry,
    output: Object.assign(
      {
        filename: "bundle.js",
        path: path.resolve(__dirname, "..", "..", "dist"),
        sourceMapFilename: "[file].map",
      },
      options.output
    ),
    devtool: options.devtool,
    devServer: options.devServer,
    plugins: options.plugins ? plugins.concat(options.plugins) : plugins,
    stats: {
      children: false,
      chunks: false,
      modules: false,
      modulesSpace: 0,
      chunkOrigins: false,
      colors: true,
      hash: false,
      version: false,
      timings: false,
      assets: true,
      reasons: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false,
    },
    target: "web",
    resolve: {
      alias: {
        node_modules: path.resolve(__dirname, "..", "..", "node_modules"),
        fs: "browserify-fs",
      },
      mainFields: ["src", "browser", "module", "main"],
      modules: [
        "src",
        path.resolve(__dirname, "..", "..", "packages", "node_modules"),
        "node_modules",
      ],
      extensions: [".js", ".css", ".json", ".scss", ".ts", ".tsx"],
      fallback: {
        stream: require.resolve("stream-browserify"),
        crypto: require.resolve("crypto-browserify"),
        os: require.resolve("os-browserify/browser"),
        path: require.resolve("path-browserify"),
        querystring: require.resolve("querystring-es3"),
        vm: false,
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
          options: {
            projectReferences: true,
            configFile: "tsconfig.json",
          },
        },
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, "..", "..", "packages", "node_modules"),
            path.resolve(__dirname, "..", "..", "samples"),
          ],
          exclude: ["/__fixtures__/", "/__mocks__/"],
          use: {
            loader: "babel-loader",
            options: {
              rootMode: "upward",
            },
          },
        },
        {
          test: /\.css$/,
          include: [
            path.resolve(__dirname, "..", "..", "packages", "node_modules"),
          ],
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: "css-loader",
              options: {
                camelCase: true,
                modules: true,
                localIdentName: `${
                  env && env.package ? env.package : "widget"
                }--[local]--[hash:base64:5]`,
                importLoaders: 1,
              },
            },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: () => [
                  postcssPresetEnv({
                    stage: 0,
                    browsers: ["last 2 versions", "IE > 10"],
                  }),
                ],
              },
            },
          ],
        },
        {
          // Do not transform vendor`s CSS with CSS-modules
          test: /\.css$/,
          include: [path.resolve(__dirname, "..", "..", "node_modules")],
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/,
          include: [
            path.resolve(__dirname, "..", "..", "packages", "node_modules"),
            path.resolve(__dirname, "..", "..", "samples"),
          ],
          use: [
            {
              // Adding sass converted files to our main.css does not work on IE/Edge
              loader: "style-loader",
            },
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("node-sass"),
              },
            },
          ],
        },
        {
          test: /\.woff$|\.woff2$|.ttf$|\.otf$|\.eot$|\.svg$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "fonts/[name].[hash].[ext]",
              },
            },
          ],
        },
        {
          test: /\.mp3$|\.wav$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "media/[name].[hash].[ext]",
              },
            },
          ],
        },
        {
          test: /.*\.(gif|png|jpg)$/,
          use: ["file-loader?name=[name].[hash].[ext]"],
        },
      ],
    },
  };
};
