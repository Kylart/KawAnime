const { app } = require('electron')

const protocols = [
  'magnet',
  'stream-magnet'
]

const isDefaultHandler = (req, res) => {
  res.send(protocols.some((protocol) => app.isDefaultProtocolClient(protocol)))
}

const setDefaultHandler = (req, res) => {
  const results = protocols.map((protocol) => app.setAsDefaultProtocolClient(protocol))
  const isOk = results.every(Boolean)

  res.status(isOk ? 200 : 204).send()
}

module.exports = {
  setDefaultHandler,
  isDefaultHandler
}
