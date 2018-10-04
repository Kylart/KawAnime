const { openExternal, openInBrowser } = require('./openExternal.js')

const routes = [
  (app) => app.get('/openThis', openExternal),
  (app) => app.get('/_openInBrowser', openInBrowser)
]

module.exports = routes
