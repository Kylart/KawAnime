const { resetInfo, getFiles, saveInfo, getInfo } = require('./local.js')

const routes = [
  (app) => app.get('/local/files', getFiles),
  (app) => app.get('/local/info', getInfo),
  (app) => app.delete('/local/reset', resetInfo),
  (app) => app.post('/local/save', saveInfo)
]

module.exports = routes
