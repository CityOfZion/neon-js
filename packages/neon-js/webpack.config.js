const common = require("../../webpack.common");

const base = common(__dirname);
module.exports = function() {
  const nodeOutput = Object.assign({}, base, {
    target: "node",
    output: {
      path: __dirname,
      filename: "./dist/index.js",
      libraryTarget: "commonjs2"
    }
  });
  nodeOutput.optimization = Object.assign({}, nodeOutput.optimization, {
    minimize: false
  });

  const webOutput = Object.assign({}, base, {
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
