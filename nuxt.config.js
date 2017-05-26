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
    {src: join(__dirname, 'css/app.styl'), lang: 'styl'},
    'assets/main.css'
  ],
  head: {
    title: 'KawAnime',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', href: 'http://fonts.googleapis.com/css?family=Roboto'},
      {rel: 'stylesheet', href: 'http://fonts.googleapis.com/icon?family=Material+Icons'}
    ]
  }
}
