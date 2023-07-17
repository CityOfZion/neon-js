const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const common = require("../../webpack.common");
const base = common(__dirname);
module.exports = function () {
  const nodeOutput = Object.assign({}, base, {
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      libraryTarget: "commonjs2",
    },
  });
  nodeOutput.optimization = Object.assign({}, nodeOutput.optimization, {
    minimize: false,
  });

  const webOutput = Object.assign({}, base, {
    target: "web",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "browser.js",
      libraryTarget: "umd",
      library: "Neon", // This is the var name in browser
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
    ],
    optimization: {
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              ascii_only: true
            }
          }
        })
      ]
    }
  });

  return [nodeOutput, webOutput];
};
