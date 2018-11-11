const { getWatchList } = require('./scrap.js')
const { initOfficialApi, actOnList, getCreds } = require('./official.js')

const routes = [
  (app) => app.get('/getWatchList', getWatchList),
  (app) => app.post('/_initOfficalApi', initOfficialApi),
  (app) => app.post('/actOnMalList', actOnList),
  (app) => app.get('/mal/credentials', getCreds)
]

module.exports = routes
