const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { DefinePlugin } = require('webpack')
const path = require('path')

const dotenv = require('dotenv').config({path: __dirname + '/.env'})

module.exports = {
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    host: '0.0.0.0',
    disableHostCheck: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'public/index.html',
      apiKeys: {
        google: process.env.GOOGLE_API_KEY
      }
    }),
    new CopyWebpackPlugin([{ from: 'public' }]),
    new DefinePlugin({
      'process.env': dotenv.parsed
    })
  ]
}
