const {init, add, remove, infoClient, infoTorrents} = require('./torrent.js')

const routes = [
  (app) => app.get('/torrent/init', init),
  (app) => app.get('/torrent/add', add),
  (app) => app.delete('/torrent/remove', remove),
  (app) => app.get('torrent/client/info', infoClient),
  (app) => app.get('torrent/torrents/info', infoTorrents)
]

module.exports = routes
