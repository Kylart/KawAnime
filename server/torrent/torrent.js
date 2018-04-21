const WebTorrent = require('webtorrent')
const {Logger} = require('../utils')
const logger = new Logger('Torrent Client')

// TODO Limit download speed, check https://github.com/webtorrent/webtorrent/issues/163
let client = null

const init = (req, res) => {
  client = process.torrentClient = new WebTorrent()
  logger.info('Instanciated torrent client.')

  // Setting up all listeners
  client.on('torrent', (torrent) => {
    logger.info(`${torrent.infoHash} is ready to be used.`)
  })

  client.on('error', (err) => {
    logger.error('Client encounered an error.', err)
  })

  res.send()
}

const add = ({query: {magnet}}, res) => {
  if (!client) {
    init(null, res)
  }

  client.add(magnet)
  logger.info(`Added magnet to torrent: ${magnet}`)
  logger.info(`Now having ${client.torrents.length} torrents.`)

  res.send()
}

const remove = ({query: {magnet}}, res) => {
  if (!client) {
    client = process.torrentClient
  }

  client.remove(magnet, (err) => {
    err
      ? logger.error(`Error while removing ${magnet}`, err)
      : logger.info(`Removed magnet to torrent: ${magnet}`)

    if (!client.torrents.length) {
      client.destroy((err) => {
        err
          ? logger.error('Could not destroy client.', err)
          : logger.info('Successfully destroyed client.')
      })
    }
  })

  res.send()
}

const events = (req, res) => {

}

module.exports = {
  init,
  add,
  remove,
  events
}
