const {init, add, remove, infoClient} = require('./torrent.js')

const routes = [
  (app) => app.get('/torrent/init', init),
  (app) => app.get('/torrent/add', add),
  (app) => app.delete('/torrent/remove', remove),
  (app) => app.all('torrent/client/info', infoClient)
]

module.exports = routes
