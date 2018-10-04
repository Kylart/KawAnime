const { getNews } = require('./news.js')

const routes = [
  (app) => app.get('/news', getNews)
]

module.exports = routes
