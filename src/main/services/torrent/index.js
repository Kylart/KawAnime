import { app } from 'electron'

import bindings from 'kawabinds/torrent'
import { sendToWindows } from '../../externals'
import { eventsList } from 'vendor'
import { save, load } from './storage'
import { Logger } from '../../utils'

const logger = new Logger('Torrent')

const events = eventsList.torrent

// Torrent client
let client = null
let infoIntervalID = null
const torrentsMap = []

app.on('quit', () => {
  client && save(client, torrentsMap)
})

app.once('ready', () => load(init))

const isClientDestroyed = () => !client || (client && client.isDestroyed())

function initInfoInterval () {
  if (!infoIntervalID) {
    infoIntervalID = setInterval(() => {
      if (isClientDestroyed()) return

      sendToWindows(events.info.success, info())

      if (!client.getTorrents().length) {
        stopInfoInterval()

        // Destroying client, kinda
        logger.info('No torrent left in client. Destroying client.')
        client = null
      }
    }, 1000)
  }
}

function stopInfoInterval () {
  if (infoIntervalID) {
    clearInterval(infoIntervalID)
    infoIntervalID = null
  }
}

function init () {
  if (isClientDestroyed()) {
    logger.info('Instanciating torrent client.')
    client = new bindings.torrent.Client()

    // Sending client information to windows every second
    initInfoInterval()
  } else {
    logger.info('Torrent client already instanciated.')
  }

  return client
}

function add (event, { magnet, path }) {
  isClientDestroyed() && init()

  const addedId = client.addTorrent(path, magnet)

  initInfoInterval()
  torrentsMap.push({ id: addedId, magnet, path })

  event.sender.send(events.add.success)
}

function info (event) {
  if (isClientDestroyed()) {
    if (!event) return

    event.sender.send(events.info.success, null)
    return
  }

  try {
    const result = {
      client: client.getClientInfo(),
      torrents: client.getTorrents().map((torrent) => torrent.info())
    }

    if (!event) return result
    event.sender.send(events.info.success, result)
  } catch (e) {
    logger.error('Could not retrieve client info', e.message)

    return {
      client: {},
      torrents: []
    }
  }
}

function actOnTorrent (event, { torrent, action }) {
  try {
    logger.info(`${action} requested on torrent ${torrent.id}`)

    const success = {
      resume: (id) => client.getTorrent(id).resume(),
      pause: (id) => client.getTorrent(id).pause(),
      destroy: (id) => {
        client.removeTorrent(id)

        const torrentIdx = torrentsMap.findIndex(({ id: refId }) => refId === id)
        torrentIdx !== -1 && torrentsMap.splice(torrentIdx, 1)
      }
    }[action](torrent.id)

    info(event)

    success
      ? event.sender.send(events.act.success)
      : event.sender.send(events.act.error, { msg: `Could not ${action} torrent, please retry later.` })
  } catch (e) {
    logger.error('Could not act on torrent', { action, msg: e.message, torrent })
    event.sender.send(events.act.error, { msg: `An error occurred while trying to ${action} torrent.` })
  }
}

export default [
  { eventName: events.add.main, handler: add },
  { eventName: events.act.main, handler: actOnTorrent },
  { eventName: events.info.main, handler: info }
]
