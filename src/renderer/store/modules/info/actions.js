import { ipcRenderer } from '@/store/utils'
import { eventsList } from 'vendor'
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
  get ({ rootState, state }, args) {
    const params = {
      provider: args.provider || state.modal.overrideProvider || rootState.config.config.infoProvider.info,
      toSearch: args
    }

    ipcRenderer.send(eventsList.search[args.url ? 'url' : 'name'].main, params)
  },
  getEps ({ rootState }, { malId, name, id }) {
    const provider = rootState.config.config.infoProvider.episodes
    const infoProvider = rootState.config.config.infoProvider.info

    ipcRenderer.send(eventsList.episodes.main, { infoProvider, provider, name, id, malId })
  },
  getEpsLinks (store, { name, config }) {
    ipcRenderer.send(eventsList.download.main, { name, ...config })
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
