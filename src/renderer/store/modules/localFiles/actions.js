import { ipcRenderer } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
  },
  update ({ state }) {
    ipcRenderer.send(eventsList.local.get.main, { dir: state.dir, isRecursive: state.recursiveSearch })
  },
  reset (store, titles) {
    ipcRenderer.sendSync(eventsList.local.update.main, {
      isReset: true,
      titles
    })
  },

  setEvents ({ rootState, commit, dispatch }) {
    ipcRenderer.on(eventsList.local.get.success, (e, data) => {
      handlers.get.success(commit, data)
    })
    ipcRenderer.on(eventsList.local.get.error, (e, msg) => {
      handlers.get.error(msg)
    })

    ipcRenderer.on(eventsList.local.update.success, (e, data) => {
      handlers.update.success({ rootState, commit, dispatch }, data)
    })
    ipcRenderer.on(eventsList.local.update.error, (e, msg) => {
      handlers.update.error(msg)
    })
  }
}
