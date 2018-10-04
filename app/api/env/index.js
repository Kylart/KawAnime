const getEnv = require('./env.js')
const isOnline = require('./isOnline.js')
const { actOnWin, toggleFullScreen } = require('./win.js')
const getNotes = require('./releaseNotes.js')
const updateReleaseVersion = require('./updateReleaseVersion.js')

const routes = [
  (app) => app.get('/_win', actOnWin),
  (app) => app.get('/_fullScreen', toggleFullScreen),
  (app) => app.get('/_env', getEnv),
  (app) => app.get('/_isOnline', isOnline),

  (app) => app.get('/releaseNotes', getNotes),
  (app) => app.get('/updateReleaseVersion', updateReleaseVersion)
]

module.exports = routes
