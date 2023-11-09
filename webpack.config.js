// const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
// const { BaseHrefWebpackPlugin } = require("base-href-webpack-plugin");

module.exports = {
  //   plugins: [new NodePolyfillPlugin()],
  //   target: "node",
  //   resolve: {
  //     fallback: {
  //       url: false,
  //       buffer: false,
  //       timers: false,
  //     },
  //   },
  output: {
    path: `${__dirname}/dist`,
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    historyApiFallback: true,
  },
  // output: {
  //   path: path.join(__dirname, "../public"),
  //   filename: "bundle.js",
  //   publicPath: "https://se.ifmo.ru/~s284699/soa-front/",
  // },
  // devServer: {
  //   port: 3000,
  // },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /nodeModules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
    // new webpack.ProvidePlugin({
    //   process: "process/browser",
    // }),
    // new webpack.EnvironmentPlugin({ ...process.env }),
  ],
};
