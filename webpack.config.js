const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ZopfliPlugin = require('zopfli-webpack-plugin')

let common = {
  entry: './src/index.js',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
            plugins: [require('babel-plugin-transform-object-rest-spread')]
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

module.exports = function (env) {
  if (env.prod) {
    common.plugins = common.plugins.concat([
      new UglifyJSPlugin({
        parallel: true,
        sourceMap: true
      }),
      new ZopfliPlugin({
        asset: '[path].gz[query]',
        algorithm: 'zopfli',
        test: /\.(js|html)$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production')
        }
      })
    ])
  } else {
    common.devtool = 'source-map'
  }
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
