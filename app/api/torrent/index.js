const { init, add, remove, info, togglePlay } = require('./torrent.js')

const routes = [
  (app) => app.get('/torrent/init', init),
  (app) => app.get('/torrent/add', add),
  (app) => app.delete('/torrent/remove', remove),
  (app) => app.get('/torrent/info', info),
  (app) => app.get('/torrent/togglePlay', togglePlay)
]

module.exports = routes
