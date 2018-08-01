const {getNews} = require('./news.js')

const routes = [
  (app) => app.get('/news.json', getNews)
]

module.exports = routes
