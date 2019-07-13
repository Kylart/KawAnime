import { ipcRenderer } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
    dispatch('get')
  },
  get ({ dispatch }) {
    ipcRenderer.send(eventsList.history.get.main)
  },
  append (store, data) {
    ipcRenderer.send(eventsList.history.append.main, data)
  },
  remove ({ dispatch }, data) {
    ipcRenderer.send(eventsList.history.remove.main, data)
  },

  setEvents ({ commit, dispatch }) {
    ipcRenderer.on(eventsList.history.get.success, (e, data) => {
      handlers.get.success(commit, data)
    })
    ipcRenderer.on(eventsList.history.get.error, (e, msg) => {
      handlers.get.error(msg)
    })

    ipcRenderer.on(eventsList.history.append.success, () => {
      handlers.append.success(dispatch)
    })
    ipcRenderer.on(eventsList.history.append.error, (e, msg) => {
      handlers.append.error(msg)
    })

    ipcRenderer.on(eventsList.history.remove.success, () => {
      handlers.remove.success(dispatch)
    })
    ipcRenderer.on(eventsList.history.remove.error, (e, msg) => {
      handlers.remove.error(msg)
    })
  }
}
