const {
  getWatchList,
  initOfficialApi,
  actOnList
} = require('./official.js')

const routes = [
  (app) => app.get('/getWatchList', ({query}, res) => getWatchList(query, res)),
  (app) => app.post('/_initOfficalApi', (req, res) => initOfficialApi(req, res)),
  (app) => app.post('/actOnMalList', (req, res) => actOnList(req, res))
]

module.exports = routes
