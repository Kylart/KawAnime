const fs = require('fs')
const { extname } = require('path')
const WebTorrent = require('webtorrent')
const {Logger} = require('../utils')
const logger = new Logger('Torrent Client')

// TODO Limit download speed, check https://github.com/webtorrent/webtorrent/issues/163

const isClientDestroyed = () => {
  const client = process.torrentClient

  return !client || (client && client.destroyed)
}

const init = (req, res) => {
  if (isClientDestroyed()) {
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
  if (isClientDestroyed()) {
    init(null, res)
  }

  process.torrentClient.add(magnet)
  logger.info(`Added magnet to torrent: ${magnet}`)
  logger.info(`Now having ${process.torrentClient.torrents.length} torrents.`)

  res.send()
}

const remove = ({query: {magnet}}, res) => {
  // Be careful calling this one.

  magnet = (extname(magnet) === '.torrent' && fs.readFileSync(magnet)) || magnet

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

  if (isClientDestroyed()) {
    const client = process.torrentClient

    result.downloadSpeed = client.downloadSpeed
    result.uploadSpeed = client.uploadSpeed
    result.progress = client.progress
    result.ratio = client.ratio
    result.nbTorrents = client.torrents.length
  }

  res.send(result)
}

const infoTorrents = (req, res) => {
  const result = []

  if (isClientDestroyed()) {
    const torrents = process.torrentClient.torrents

    torrents.forEach((torrent) => {
      result.push(Object.assign(
        {},
        torrent.infoHash,
        torrent.magnetURI,
        torrent.torrentFile,
        torrent.files,
        torrent.timeRemaining,
        torrent.received,
        torrent.downloaded,
        torrent.uploaded,
        torrent.downloadSpeed,
        torrent.uploadSpeed,
        torrent.progress,
        torrent.ratio,
        torrent.numPeers,
        torrent.path
      ))
    })
  }

  res.send(result)
}

module.exports = {
  init,
  add,
  remove,
  infoClient,
  infoTorrents
}
