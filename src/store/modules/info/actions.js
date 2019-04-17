import { ipcRenderer } from '@/store/utils'
import { eventsList } from '@/vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
  },
  saveLocalInfo (store, data) {
    ipcRenderer.send(eventsList.local.update.main, data)
  },
  getLocalInfo (store, data) {
    ipcRenderer.send(eventsList.local.get.main, data)
  },
  get ({ rootState }, obj) {
    const params = {
      provider: rootState.config.config.infoProvider.info,
      toSearch: obj.args
    }

    ipcRenderer.send(eventsList.search[obj.method].main, params)
  },
  getEps ({ rootState }, { name, id }) {
    const searchName = name.replace('local/', '')
    const provider = rootState.config.config.infoProvider.episodes

    ipcRenderer.send(eventsList.episodes.main, { provider, name: searchName, id })
  },
  getEpsLinks (store, { name, config }) {
    const searchName = name.replace('local/', '')

    ipcRenderer.send(eventsList.download.main, { name: searchName, ...config })
  },

  setEvents ({ commit }) {
    ipcRenderer.on(eventsList.episodes.success, (e, data) => {
      handlers.episodes.success(commit, data)
    })

    ipcRenderer.on(eventsList.episodes.error, (e, msg) => {
      handlers.episodes.error(msg)
    })
  }
}
