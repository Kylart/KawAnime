const getLatest = require('./getLatest.js')
const download = require('./download.js')

const routes = [
  (app) => app.post('/download', download),
  (app) => app.get('/getLatest', getLatest)
]

module.exports = routes
