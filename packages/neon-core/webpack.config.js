const common = require("../../webpack.common");

module.exports = function() {
  const nodeOutput = Object.assign({}, common, {
    target: "node",
    output: {
      path: __dirname,
      filename: "./dist/index.js",
      libraryTarget: "umd"
    }
  });
  nodeOutput.optimization = Object.assign({}, nodeOutput.optimization, {
    minimize: false
  });

  const webOutput = Object.assign({}, common, {
    target: "web",
    output: {
      path: __dirname,
      filename: "./dist/browser.js",
      libraryTarget: "umd",
      library: "Neon" // This is the var name in browser
    }
  });

  return [nodeOutput, webOutput];
};
