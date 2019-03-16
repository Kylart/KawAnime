const { Logger } = require('../utils')
const EventEmitter = require('events')

const logger = new Logger('External')
const eventSource = new EventEmitter()

const externalListen = (req, res) => {
  eventSource.on('torrent', (torrents) => res.sse('torrent', torrents))
}

const externalSend = (req, res) => {
  let data = ''

  req.on('data', (chunk) => (data += chunk))

  req.on('end', () => {
    const { torrents } = JSON.parse(data)

    if (torrents) {
      logger.info('Received external torrent open:', torrents)
      eventSource.emit('torrent', torrents)
    }

    res.send()

    data = ''
  })
}

module.exports = {
  externalListen,
  externalSend
}
