const CleanWebpackPlugin = require('clean-webpack-plugin')

let common = {
  entry: './lib/index.js',
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
    new CleanWebpackPlugin(['dist'])
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
        filename: './dist/index.js',
        libraryTarget: 'umd'
      }
    }),
    Object.assign({}, common, {
      target: 'web',
      output: {
        path: __dirname,
        filename: './dist/browser.js',
        libraryTarget: 'umd',
        library: 'Neon' // This is the var name in browser
      }
    })
  ]
}
