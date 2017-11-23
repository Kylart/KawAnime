const {searchTerm, fromName, fromUrl} = require('./search.js')

const routes = [
  (app) => app.get('/searchTermOnMal', searchTerm),
  (app) => app.get('/getInfoFromMal', ({query}, res) =>
      query.url
        ? fromUrl(query, res)
        : fromName(query, res)
    )
]

module.exports = routes
