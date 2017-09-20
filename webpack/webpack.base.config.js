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
      'components': resolve('components'),
      'examples': resolve('pages/examples'),
      'layouts': resolve('layouts'),
      'mixins': resolve('mixins'),
      'pages': resolve('pages'),
      'public': resolve('public'),
      'router': resolve('router'),
      'static': resolve('static'),
      'store': resolve('store'),
      'vue$': 'vue/dist/vue.common.js'
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueConfig,
        include: [
          resolve('assets/App.vue'),
          resolve('pages'),
          resolve('components'),
          resolve('node_modules/vuetify')
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('components/_index.js'),
          resolve('mixins'),
          resolve('store'),
          resolve('router'),
          resolve('server'),
          resolve('assets'),
          resolve('node_modules/vuetify')
        ]
      },
      {
        test: /\.styl$/,
        // loader: ['style-loader', 'css-loader', 'stylus-loader']
        loader: ['vue-style-loader', 'css-loader', 'stylus-loader', {
          loader: 'vuetify-loader',
          options: {
            theme: resolve('assets/stylus/theme.styl')
          }
        }]
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
