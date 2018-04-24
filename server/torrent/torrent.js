const WebTorrent = require('webtorrent')
const {Logger} = require('../utils')
const logger = new Logger('Torrent Client')

// TODO Limit download speed, check https://github.com/webtorrent/webtorrent/issues/163

const isClientExisting = () => {
  const client = process.torrentClient

  return !client || (client && client.destroyed)
}

const init = (req, res) => {
  if (isClientExisting()) {
    process.torrentClient = new WebTorrent()
    logger.info('Instanciated torrent client.')

    // Setting up all listeners
    process.torrentClient.on('torrent', (torrent) => {
      logger.info(`${torrent.infoHash} is ready to be used.`)
    })

    process.torrentClient.on('error', (err) => {
      logger.error('Client encounered an error.', err)
    })
  } else {
    logger.info('Torrent client already instanciated.')
  }

  res.send()
}

const add = ({query: {magnet}}, res) => {
  if (isClientExisting()) {
    init(null, res)
  }

  process.torrentClient.add(magnet)
  logger.info(`Added magnet to torrent: ${magnet}`)
  logger.info(`Now having ${process.torrentClient.torrents.length} torrents.`)

  res.send()
}

const remove = ({query: {magnet}}, res) => {
  // Be careful calling this one.

  process.torrentClient.remove(magnet, (err) => {
    err
      ? logger.error(`Error while removing ${magnet}`, err)
      : logger.info(`Removed magnet to torrent: ${magnet}`)

    if (!process.torrentClient.torrents.length) {
      process.torrentClient.destroy((err) => {
        err
          ? logger.error('Could not destroy client.', err)
          : logger.info('Successfully destroyed client.')
      })
    }
  })

  res.send()
}

const infoClient = (req, res) => {
  const result = {}

  if (isClientExisting()) {

  }

  res.send(result)
}

module.exports = {
  init,
  add,
  remove,
  infoClient
}
