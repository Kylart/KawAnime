import { ipcRenderer } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
  },
  get ({ commit }) {
    ipcRenderer.send(eventsList.torrent.info.main)
  },
  add ({ rootState }, { torrent, path }) {
    ipcRenderer.send(eventsList.torrent.add.main, {
      magnet: torrent,
      path: path || rootState.config.config.torrentClient.defaultPath
    })
  },

  setEvents ({ commit }) {
    ipcRenderer.on(eventsList.torrent.add.success, (e, magnet) => {
      handlers.add.success(magnet)
    })
    ipcRenderer.on(eventsList.torrent.add.error, (e, msg) => {
      handlers.add.error(msg)
    })

    ipcRenderer.on(eventsList.torrent.act.success, (e, magnet) => {
      handlers.act.success(magnet)
    })
    ipcRenderer.on(eventsList.torrent.act.error, (e, msg) => {
      handlers.act.error(msg)
    })

    ipcRenderer.on(eventsList.torrent.info.success, (e, data) => {
      handlers.info.success(commit, data)
    })
    ipcRenderer.on(eventsList.torrent.info.error, (e, msg) => {
      handlers.info.error(msg)
    })
  }
}
