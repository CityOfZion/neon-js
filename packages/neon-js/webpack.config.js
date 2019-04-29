const path = require("path");
const common = require("../../webpack.common");
const base = common(__dirname);
module.exports = function() {
  const nodeOutput = Object.assign({}, base, {
    target: "node",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.js",
      libraryTarget: "commonjs2"
    }
  });
  nodeOutput.optimization = Object.assign({}, nodeOutput.optimization, {
    minimize: false
  });

  const webOutput = Object.assign({}, base, {
    target: "web",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "browser.js",
      libraryTarget: "umd",
      library: "Neon" // This is the var name in browser
    }
  });

  return [nodeOutput, webOutput];
};
