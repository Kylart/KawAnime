const {getLatest} = require('./horrible.js')

const routes = [
  (app) => app.get('/getLatest.json', getLatest)
]

module.exports = routes
