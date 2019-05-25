import { ipcRenderer, log } from '@/store/utils'
import { eventsList } from '@/vendor'
import * as handlers from './handlers'
import { providers } from '../lists.js'

export default {
  init ({ state, dispatch }) {
    dispatch('setEvents')

    // Checking if we have a registered user for each service
    providers.forEach(({ value }) => {
      dispatch('hasUser', value)
      dispatch('isConnected', value)
    })
  },
  set (store, info) {
    ipcRenderer.send(eventsList.vault.update.main, info)
  },
  hasUser ({ rootState, commit }, service) {
    const properties = rootState.config.providersRequiredProperties[service]
      .filter(({ value }) => value !== 'password')
      .map(({ value }) => value)

    ipcRenderer.send(eventsList.vault.has.main, { service, properties })
  },
  isConnected (store, service) {
    ipcRenderer.send(eventsList.register.isAuthed.main, service)
  },
  getList ({ state }, { service, username }) {
    log(`Retrieving list for ${service}.`)

    ipcRenderer.send(eventsList.watchLists.main, {
      service,
      user: username || state[service].username
    })
  },
  external (store, { service, code }) {
    if (service === 'anilist') {
      ipcRenderer.send(eventsList.register.token.main, { service, code })
    }
  },

  setEvents ({ state, commit, dispatch }) {
    ipcRenderer.on(eventsList.watchLists.success, (e, data) => {
      handlers.watchLists.success(commit, data)
    })

    ipcRenderer.on(eventsList.watchLists.error, (e, data) => {
      handlers.watchLists.error(commit, data)
    })

    ipcRenderer.on(eventsList.vault.has.success, (e, data) => {
      handlers.has.success({ commit, state, dispatch }, data)
    })

    ipcRenderer.on(eventsList.register.isAuthed.success, (e, args) => {
      commit('setConnected', args)
    })
  }
}
