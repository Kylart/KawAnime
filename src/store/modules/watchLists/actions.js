import { ipcRenderer } from '@/store/utils'
import { eventsList } from '@/vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
    dispatch('get')
  },
  get () {
    ipcRenderer.send(eventsList.localLists.get.main)
  },
  add (store, entry) {
    ipcRenderer.send(eventsList.localLists.update.main, entry)
  },

  setEvents ({ commit }) {
    ipcRenderer.on(eventsList.localLists.get.success, (e, data) => {
      handlers.get.success(commit, data)
    })
    ipcRenderer.on(eventsList.localLists.get.error, (e, msg) => {
      handlers.get.error(msg)
    })

    ipcRenderer.on(eventsList.localLists.update.success, () => {
      handlers.update.success()
    })
    ipcRenderer.on(eventsList.localLists.update.error, (e, msg) => {
      handlers.update.error(msg)
    })
  }
}
