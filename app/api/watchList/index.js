const {get, save} = require('./watchList.js')

const routes = [
  (app) => app.get('/watchList.json', get),
  (app) => app.post('/saveWatchList', save)
]

module.exports = routes
