const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ZopfliPlugin = require('zopfli-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const common = {
  entry: './src/index.js',
  devtool: 'source-map',
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
    new UglifyJSPlugin({
      parallel: true,
      sourceMap: true
    }),
    new BundleAnalyzerPlugin(),
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
  ]
}

module.exports = [
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
