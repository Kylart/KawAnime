const {
  appendHistory,
  getHistory,
  removeFromHistory
} = require('./history.js')

const routes = [
  (app) => app.post('/appendHistory', appendHistory),
  (app) => app.get('/getHistory', getHistory),
  (app) => app.post('/removeFromHistory', removeFromHistory)
]

module.exports = routes
