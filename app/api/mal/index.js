const { getWatchList } = require('./scrap.js')
const { initOfficialApi, actOnList } = require('./official.js')

const routes = [
  (app) => app.get('/getWatchList', getWatchList),
  (app) => app.post('/_initOfficalApi', initOfficialApi),
  (app) => app.post('/actOnMalList', actOnList)
]

module.exports = routes
