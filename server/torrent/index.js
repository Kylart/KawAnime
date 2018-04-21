const {init, add, remove, events} = require('./torrent.js')
const sseExpress = require('sse-express')

const routes = [
  (app) => app.get('/torrent/init', init),
  (app) => app.get('/torrent/add', add),
  (app) => app.delete('/torrent/remove', remove),
  (app) => app.all(/torrent\/listen(.*)/, sseExpress, events)
]

module.exports = routes
