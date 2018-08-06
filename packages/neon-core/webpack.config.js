const CleanWebpackPlugin = require('clean-webpack-plugin')

let env = process.env.NODE_ENV || 'development'

let common = {
  mode: env,
  devtool: env === 'development' ? 'source-map' : false,
  entry: './src/index.ts',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          compilerOptions: {
            declarationDir: 'dist',
            sourceMap: env === 'development'
          }
        }
      }
    ]
  },
  plugins: [new CleanWebpackPlugin(['dist'])]
}

module.exports = [
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
