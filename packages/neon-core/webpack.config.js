const CleanWebpackPlugin = require('clean-webpack-plugin')

let common = {
  entry: './src/index.js',
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

if (process.env.NODE_ENV === 'development') {
  common.devtool = 'source-map'
}

module.exports = function (mode) {
  return [
    Object.assign({}, common, {
      target: 'node',
      output: {
        path: __dirname,
        filename: './lib/index.js',
        libraryTarget: 'umd'
      }
    }),
    Object.assign({}, common, {
      target: 'web',
      output: {
        path: __dirname,
        filename: './lib/browser.js',
        libraryTarget: 'umd',
        library: 'Neon' // This is the var name in browser
      }
    })
  ]
}
