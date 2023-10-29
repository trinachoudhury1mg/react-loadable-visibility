const path = require('path');

module.exports = {
  mode: 'development',
  entry: '../index.js',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'rlv.bundle.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  },
};