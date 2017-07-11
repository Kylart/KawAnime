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
    vendor: ['vuetify', 'axios']
  },
  plugins: [
    '~plugins/vuetify.js'
  ],
  css: [
    {src: join(__dirname, 'css/mdi.css'), lang: 'css'},
    {src: join(__dirname, 'css/app.styl'), lang: 'styl'}
  ],
  head: {
    titleTemplate: '%s - KawAnime',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'}
    ]
  }
}
