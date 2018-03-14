const {stream, tracks} = require('./torrent.js')
const sseExpress = require('sse-express')

const routes = [
  (app) => app.all(/stream(.*)/, stream),
  (app) => app.get(/tracks\/(.*)/, sseExpress, tracks)
]

module.exports = routes
