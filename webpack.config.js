const CleanWebpackPlugin = require('clean-webpack-plugin')

let common = {
  entry: './src/index.js',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      }
    ]
  },
  node: {
    fs: 'empty',
    'child_process': 'empty'
  },
  plugins: [
    new CleanWebpackPlugin(['lib'])
  ]
}

module.exports = function (mode) {
  const nodeOutput = Object.assign({}, common, {
    target: 'node',
    output: {
      path: __dirname,
      filename: './lib/index.js',
      libraryTarget: 'umd'
    }
  })

  nodeOutput.optimization = Object.assign({}, nodeOutput.optimization, {minimize: false})

  const webOutput = Object.assign({}, common, {
    target: 'web',
    output: {
      path: __dirname,
      filename: './lib/browser.js',
      libraryTarget: 'umd',
      library: 'Neon' // This is the var name in browser
    }
  })
  return [nodeOutput, webOutput]
}
