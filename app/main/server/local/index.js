const {resetLocal, searchLocalFiles} = require('./local.js')

const routes = [
  (app) => app.get('/local.json', searchLocalFiles),
  (app) => app.get('/resetLocal', resetLocal)
]

module.exports = routes
