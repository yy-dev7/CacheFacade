const path = require('path')

module.exports = {
  entry: './index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'CacheFacade.min.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'CacheFacade'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }]
  },
}
