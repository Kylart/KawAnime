const { init, add, remove, info, actOnTorrent } = require('./torrent.js')

const routes = [
  (app) => app.get('/torrent/init', init),
  (app) => app.post('/torrent/add', add),
  (app) => app.delete('/torrent/remove', remove),
  (app) => app.get('/torrent/info', info),
  (app) => app.get('/torrent/act', actOnTorrent)
]

module.exports = routes
