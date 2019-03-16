const { externalListen, externalSend } = require('./external.js')
const sseExpress = require('sse-express')

const routes = [
  (app) => app.get('/external', sseExpress, externalListen),
  (app) => app.post('/external', sseExpress, externalSend)
]

module.exports = routes
