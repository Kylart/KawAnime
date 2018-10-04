const { getSeason } = require('./seasons.js')

const routes = [
  (app) => app.get('/seasons.json', getSeason)
]

module.exports = routes
