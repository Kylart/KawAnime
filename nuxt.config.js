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
    vendor: ['vuetify']
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
  },
  transition: {
    mode: 'out-in'
  }
}