const { save, get } = require('./config.js')
const { setupAccount } = require('./setupAccount.js')

const routes = [
  (app) => app.get('/getConfig.json', get),
  (app) => app.post('/saveConfig', save),

  (app) => app.post('/_setupAccount', setupAccount)
]

module.exports = routes
