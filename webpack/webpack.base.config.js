const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const resolve = (file) => path.resolve(__dirname, '..', file)

module.exports = {
  devtool: !isDev
    ? false
    : '#cheap-module-source-map',
  output: {
    path: resolve('public'),
    publicPath: '/public/',
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.vue'],
    alias: {
      'assets': resolve('assets'),
      'stylus': resolve('assets/stylus'),
      'components': resolve('components'),
      'layouts': resolve('layouts'),
      'mixins': resolve('mixins'),
      'pages': resolve('pages'),
      'public': resolve('public'),
      'router': resolve('router'),
      'static': resolve('static'),
      'store': resolve('store'),
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.styl$/,
        loader: ['vue-style-loader', 'css-loader', 'stylus-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 1000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: !isDev ? 'warning' : false
  },
  plugins: !isDev
    ? [
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css'
      }),
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true,
          discardComments: { removeAll: true }
        }
      }),
      new ProgressBarPlugin({
        format: chalk.cyan('> build') + ' [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
      })
    ]
    : [
      new FriendlyErrorsPlugin()
    ]
}
