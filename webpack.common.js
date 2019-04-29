const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");

let env = process.env.NODE_ENV || "development";

module.exports = function(rootDir) {
  return {
    mode: env,
    devtool: env === "development" ? "inline-source-map" : "source-map",
    entry: path.resolve(rootDir, "src", "index.ts"),
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          options: {
            compilerOptions: {
              declarationDir: path.resolve(rootDir, "dist"),
              sourceMap: env === "development",
              module: "commonjs"
            }
          }
        }
      ]
    },
    // plugins: [new CleanWebpackPlugin({verbose: true})]
  };
};
