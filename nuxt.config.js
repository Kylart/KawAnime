const {join} = require('path')

module.exports = {
  /*
   ** Electron Settings
   */
  electron: {
    width: 1200,
    height: 800
  },
  build: {
    extend (config, {isClient}) {
      // Extend only webpack config for client-bundle
      if (isClient)
      {
        config.target = 'electron-renderer'
      }
    },
    vendor: ['vuetify', 'axios']
  },
  plugins: [
    '~plugins/vuetify.js'
  ],
  css: [
    {src: join(__dirname, 'css/app.styl'), lang: 'styl'},
    'assets/main.css'
  ],
  head: {
    link: [
      {rel: 'stylesheet', href: 'http://fonts.googleapis.com/css?family=Roboto'},
      {rel: 'stylesheet', href: 'http://fonts.googleapis.com/icon?family=Material+Icons'}
    ]
  }
}