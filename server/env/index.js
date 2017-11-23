const getEnv = require('./env.js')
const isOnline = require('./isOnline.js')
const {actOnWin} = require('./win.js')
const getNotes = require('./releaseNotes.js')

const routes = [
  (app) => app.get('/_win', actOnWin),
  (app) => app.get('/_env', getEnv),
  (app) => app.get('/_isOnline', isOnline),

  (app) => app.get('/releaseNotes', getNotes)
]

module.exports = routes
