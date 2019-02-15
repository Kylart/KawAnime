const fs = require('fs')
const { extname } = require('path')
const WebTorrent = require('webtorrent')
const { Logger } = require('../utils')
const logger = new Logger('Torrent Client')

// TODO Limit download speed, check https://github.com/webtorrent/webtorrent/issues/163

const peersMap = {}

const cleanTorrents = (torrents) => {
  return torrents.map((torrent) => ({
    infoHash: torrent.infoHash,
    magnetURI: torrent.magnetURI,
    timeRemaining: torrent.timeRemaining,
    received: torrent.received,
    downloaded: torrent.downloaded,
    uploaded: torrent.uploaded,
    downloadSpeed: torrent.downloadSpeed,
    uploadSpeed: torrent.uploadSpeed,
    progress: torrent.progress,
    ratio: torrent.ratio,
    numPeers: torrent.numPeers,
    path: torrent.path,
    ready: torrent.ready,
    files: torrent.files.map((file) => ({
      name: file.name,
      path: file.path,
      done: file.done,
      progress: file.progress
    }))
  }))
}

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
      logger.error('Client encountered an error.', err)
    })
  } else {
    logger.info('Torrent client already instanciated.')
  }

  res && res.send()
}

const add = (req, res) => {
  let data = ''

  req.on('data', (chunk) => (data += chunk))

  req.on('end', () => {
    if (isClientDestroyed()) {
      init(null, null)
    }

    const { magnet, path } = JSON.parse(data)

    process.torrentClient.add(magnet, { path }, (torrent) => {
      logger.info(`Added ${torrent.infoHash}.`)
    })

    res.send()
  })
}

const remove = ({ query: { magnet } }, res) => {
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

  res && res.send()
}

const info = (req, res) => {
  if (isClientDestroyed()) {
    res.status(204).send({})
  } else {
    const client = process.torrentClient

    const result = {
      client: {
        downloadSpeed: client.downloadSpeed,
        uploadSpeed: client.uploadSpeed,
        ratio: client.ratio,
        progress: client.progress
      },
      torrents: cleanTorrents(client.torrents) || []
    }

    res.send(result)
  }
}

const actOnTorrent = ({ query: { magnet, action } }, res) => {
  // Running this implies that there is a client.
  const client = process.torrentClient
  const _torrent = client.get(magnet)

  switch (action) {
    case 'resume':
      // Reconnecting old torrent
      _torrent.resume()

      // Reconnecting peers
      if (peersMap[magnet]) {
        peersMap[magnet].forEach((peerId) => _torrent.addPeer(peerId))
      }

      break

    case 'pause':
      // Only stops connection to new peers, must delete all existing peers now
      _torrent.pause()

      // Removing all connected peers
      Object.keys(_torrent._peers).forEach((peerId) => {
        if (!peersMap[magnet]) peersMap[magnet] = []

        peersMap[magnet].push(peerId)

        _torrent.removePeer(peerId)
      })

      break

    case 'destroy':
      remove({ query: { magnet } })

      break

    default:
      break
  }

  _torrent[action]()

  res.send()
}

module.exports = {
  init,
  add,
  remove,
  info,
  actOnTorrent
}
