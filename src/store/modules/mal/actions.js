import { ipcRenderer, log } from '@/store/utils'
import { eventsList } from '@/vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
    dispatch('getCredentials')
  },
  setCredentials ({ state, commit }, credentials) {
    const response = ipcRenderer.sendSync(eventsList.vault.update.main, {
      service: state.service,
      credentials
    })

    if (response.error) throw new Error(response.error)

    commit('setCredentials', credentials)
  },
  getCredentials ({ state, commit }) {
    const response = ipcRenderer.sendSync(eventsList.vault.get.main, state.service)

    if (response.error) {
      log('An error occurred while retrieving crendentials.', response.error)
      return
    }

    commit('setCredentials', response)
  },
  checkCredentials ({ state }) {
    const response = ipcRenderer.sendSync(eventsList.vault.check.main, state.credentials)

    if (response.error) {
      throw new Error(response.error)
    }
  },
  getWatchLists ({ state, commit }, user) {
    commit('isLoading', true)
    ipcRenderer.send(eventsList.watchLists.main, user)
  },
  // TODO
  // actOnList ({ rootState, state, commit, dispatch }, data) {
  //   ipcRenderer.send(eventsList.services.act.main, data)
  // },
  setEvents ({ commit, dispatch }) {
    ipcRenderer.on(eventsList.watchLists.success, (e, data) => {
      handlers.success(commit, data)
    })

    ipcRenderer.on(eventsList.watchLists.error, (e, msg) => {
      handlers.error(msg)
    })

    // TODO
    ipcRenderer.on(eventsList.services.act.success, () => { })
    ipcRenderer.on(eventsList.services.act.error, () => {})
  }
}
