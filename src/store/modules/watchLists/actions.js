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
    ipcRenderer.send(eventsList.localLists.update.main, { type: entry.list, data: entry })
  },
  delete (store, entry) {
    ipcRenderer.send(eventsList.localLists.update.main, { type: entry.list, data: entry, isDelete: true })
  },
  info (store, entries) {
    ipcRenderer.send(eventsList.localLists.info.main, entries)
  },

  setEvents ({ rootState, commit, dispatch }) {
    ipcRenderer.on(eventsList.localLists.get.success, (e, data) => {
      handlers.get.success({ rootState, commit, dispatch }, data)
    })
    ipcRenderer.on(eventsList.localLists.get.error, (e, msg) => {
      handlers.get.error(msg)
    })

    ipcRenderer.on(eventsList.localLists.update.success, (e, data) => {
      handlers.update.success({ rootState, commit, dispatch }, data)
    })
    ipcRenderer.on(eventsList.localLists.update.error, (e, msg) => {
      handlers.update.error(msg)
    })

    ipcRenderer.on(eventsList.localLists.info.success, (e, data) => {
      handlers.info.success(commit, data)
    })
    ipcRenderer.on(eventsList.localLists.info.error, (e, msg) => {
      handlers.info.error(msg)
    })
  }
}
