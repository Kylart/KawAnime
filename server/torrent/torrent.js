const WebTorrent = require('webtorrent')
const {Logger} = require('../utils')
const logger = new Logger('Torrent Client')

// TODO Limit download speed, check https://github.com/webtorrent/webtorrent/issues/163

const init = (req, res) => {
  process.torrentClient = new WebTorrent()
  logger.info('Instanciated torrent client.')

  // Setting up all listeners
  process.torrentClient.on('torrent', (torrent) => {
    logger.info(`${torrent.infoHash} is ready to be used.`)
  })

  process.torrentClient.on('error', (err) => {
    logger.error('Client encounered an error.', err)
  })

  res.send()
}

const add = ({query: {magnet}}, res) => {
  if (!process.torrentClient) {
    init(null, res)
  }

  process.torrentClient.add(magnet)
  logger.info(`Added magnet to torrent: ${magnet}`)
  logger.info(`Now having ${process.torrentClient.torrents.length} torrents.`)

  res.send()
}

const remove = ({query: {magnet}}, res) => {
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

const events = (req, res) => {

}

module.exports = {
  init,
  add,
  remove,
  events
}
