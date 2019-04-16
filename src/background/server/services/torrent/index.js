import WebTorrent from 'webtorrent'
import { extname, join } from 'path'
import { readFileSync, createReadStream, watchFile, unwatchFile } from 'fs'
import { BrowserWindow, app } from 'electron'

import generateServer from '../video/createServer'
import { parseSubtitles } from '../../externals'
import { eventsList } from '../../../../vendor'
import cleanTorrents from './format'
import { save, load } from './storage'
import { Logger } from '../../utils'

const logger = new Logger('Torrent')

const events = eventsList.torrent

// TODO Limit download speed, check https://github.com/webtorrent/webtorrent/issues/163

const peersMap = {}
let client = null
let infoIntervalID = null
let streamServer = null
let subtitleStream = null
let streamingFilePath = null

app.on('quit', () => {
  client && save(client)
})

app.once('ready', () => load(client, init))

const isClientDestroyed = () => !client || (client && client.destroyed)

function init () {
  if (isClientDestroyed()) {
    client = new WebTorrent()
    logger.info('Instanciated torrent client.')

    // Setting up all listeners
    client.on('torrent', (torrent) => {
      logger.info(`${torrent.infoHash} is ready to be used.`)
    })

    client.on('error', (err) => {
      logger.error('Client encountered an error.', err)
    })

    // Sending client information to windows every second
    infoIntervalID = setInterval(() => {
      BrowserWindow.getAllWindows().forEach(
        (win) => win.webContents.send(events.info.success, info())
      )
    }, 1000)
  } else {
    logger.info('Torrent client already instanciated.')
  }
}

function add (event, { magnet, path }) {
  if (isClientDestroyed()) {
    init()
  }

  client.add(magnet, { path }, (torrent) => {
    logger.info(`Added ${torrent.infoHash}.`)
    event.sender.send(events.add.success)
  })
}

function remove (event, magnet) {
  if (isClientDestroyed()) {
    event.sender.send(events.destroy.error)
    return
  }

  // If it comes from streaming, we have to close the streams
  streamServer && streamServer.close()
  subtitleStream = null
  streamingFilePath = null

  // Be careful calling this one.
  magnet = (extname(magnet) === '.torrent' && readFileSync(magnet)) || magnet

  client.remove(magnet, (err) => {
    err
      ? logger.error(`Error while removing ${magnet}`, err)
      : logger.info(`Removed magnet to torrent: ${magnet}`)

    if (!client.torrents.length) {
      client.destroy((err) => {
        err
          ? logger.error('Could not destroy client.', err)
          : logger.info('Successfully destroyed client.') && infoIntervalID && clearInterval(infoIntervalID)
      })
    }
  })
}

function info (event) {
  if (isClientDestroyed()) {
    if (!event) return

    event.sender.send(events.info.success, null)
    return
  }

  const result = {
    client: {
      downloadSpeed: client.downloadSpeed,
      uploadSpeed: client.uploadSpeed,
      ratio: client.ratio,
      progress: client.progress,
      nbTorrents: client.torrents.length
    },
    torrents: cleanTorrents(client.torrents) || []
  }

  if (!event) return result
  event.sender.send(events.info.success, result)
}

function actOnTorrent (event, { magnet, action }) {
  // Running this implies that there is a client.
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
      return remove(event, magnet)

    default:
      break
  }

  _torrent[action]()

  event.sender.send(events.act.success)
}

function play (event, { link: id }) {
  if (isClientDestroyed()) init()

  const isFile = !/^magnet/.test(id)
  const torrent = client.get(id)

  function createServers (torrent) {
    streamServer = generateServer(torrent)

    streamServer.listen()
    const address = streamServer.address()

    logger.info(`Created video server for ${id} at ${address.port}`)

    event.sender.send(events.play.success, { torrent: id, name: torrent.name, port: address.port })

    const filePath = streamingFilePath = join(torrent.path, torrent.files[0].path)

    watchFile(filePath, (current) => {
      if (current.size === 0) return

      subtitleStream = createReadStream(streamingFilePath)
      parseSubtitles(event, subtitleStream)

      subtitleStream.read()

      unwatchFile(streamingFilePath)
    })
  }

  if (!torrent) {
    client.add(isFile ? readFileSync(id) : id, createServers)
  } else {
    torrent.ready
      ? createServers(torrent)
      : torrent.once('ready', () => createServers(torrent))
  }
}

export default [
  { eventName: events.add.main, handler: add },
  { eventName: events.destroy.main, handler: remove },
  { eventName: events.act.main, handler: actOnTorrent },
  { eventName: events.info.main, handler: info },
  { eventName: events.play.main, handler: play }
]
