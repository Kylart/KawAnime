const {stream} = require('./torrent.js')

const routes = [
  (app) => app.all(/stream(.*)/, stream)
]

module.exports = routes
