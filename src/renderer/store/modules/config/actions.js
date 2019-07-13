import { ipcRenderer, isRoot } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
    dispatch('get')
  },
  get () {
    ipcRenderer.send(eventsList.config.get.main)
  },
  save ({ state }) {
    ipcRenderer.send(eventsList.config.update.main, { config: state.config })
  },
  changeDir ({ commit, dispatch }) {
    const data = null

    if (data) {
      commit('setDir', data.path)
      commit('localFiles/empty', null, isRoot)
      commit('localFiles/setDir', data.path, isRoot)
      dispatch('localFiles/refresh', null, isRoot)
    }
  },

  setEvents ({ commit, dispatch }) {
    ipcRenderer.on(eventsList.config.get.success, (e, data) => {
      handlers.get.success({ commit, dispatch }, data)
    })

    ipcRenderer.on(eventsList.config.get.error, (e, msg) => {
      handlers.get.error(commit, msg)
    })

    ipcRenderer.on(eventsList.config.update.success, () => {
      handlers.update.success(dispatch)
    })

    ipcRenderer.on(eventsList.config.update.error, (e, msg) => {
      handlers.update.error(commit, msg)
    })
  }
}
