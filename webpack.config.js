

module.exports = {
  entry: {
	  api: './src/api.ts',
	  tests: './tests/index.ts',
  },
  target: 'node',
  output: {
      path: __dirname,
      filename: './lib/[name].js',
      libraryTarget: 'umd'
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ],
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
    fs: 'empty'
  }
}
