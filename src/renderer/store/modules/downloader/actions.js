import { ipcRenderer } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
  },
  download (store, config) {
    ipcRenderer.send(eventsList.download.main, { ...config, modal: true })
  },

  setEvents ({ commit }) {
    ipcRenderer.on(eventsList.download.success, (e, data) => {
      handlers.success(commit, data)
    })

    ipcRenderer.on(eventsList.download.error, (e, msg) => {
      handlers.error(msg)
    })
  }
}
