import { ipcRenderer, log } from '@/store/utils'
import { eventsList } from 'vendor'
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
  getList ({ state, commit }, { service, username }) {
    log(`Retrieving list for ${service}.`)

    commit('setLoading', { service, value: true })

    ipcRenderer.send(eventsList.watchLists.get.main, {
      service,
      user: username || state[service].username
    })
  },
  updateList ({ state }, { service, args }) {
    ipcRenderer.send(eventsList.watchLists.update.main, {
      service,
      args
    })
  },
  external (store, { service, access_token: accessToken, expires_in: expiresIn, token_type: tokenType }) {
    if (service === 'anilist') {
      ipcRenderer.send(eventsList.register.token.main, { service, accessToken, expiresIn, tokenType })
    }
  },

  setEvents ({ state, commit, dispatch }) {
    ipcRenderer.on(eventsList.watchLists.get.success, (e, data) => {
      handlers.watchLists.get.success(commit, data)
    })

    ipcRenderer.on(eventsList.watchLists.get.error, (e, data) => {
      handlers.watchLists.get.error(commit, data)
    })

    ipcRenderer.on(eventsList.watchLists.update.success, (e, data) => {
      handlers.watchLists.update.success({ commit, dispatch }, data)
    })

    ipcRenderer.on(eventsList.watchLists.update.error, (e, data) => {
      handlers.watchLists.update.error(commit, data)
    })

    ipcRenderer.on(eventsList.vault.has.success, (e, data) => {
      handlers.has.success({ commit, state, dispatch }, data)
    })

    ipcRenderer.on(eventsList.register.isAuthed.success, (e, args) => {
      commit('setConnected', args)
    })
  }
}
