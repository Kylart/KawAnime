const { stream, tracks } = require('./streaming.js')
const sseExpress = require('sse-express')

const routes = [
  (app) => app.all(/stream(.*)/, stream),
  (app) => app.get(/tracks\/(.*)/, sseExpress, tracks)
]

module.exports = routes
