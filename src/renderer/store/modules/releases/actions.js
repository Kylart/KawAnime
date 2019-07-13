import { ipcRenderer, log } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')

    dispatch('autoRefresh')
  },
  refresh ({ rootState, state, commit, dispatch }) {
    if (!rootState.isConnected) {
      log('Cancelling feed update, user is offline.')
      setTimeout(() => {
        dispatch('refresh')
      }, 1 * 60 * 1000)
      return
    }

    commit('refreshing', true)

    ipcRenderer.send(eventsList.latest.main, state.params)
  },
  autoRefresh ({ dispatch }) {
    // Refresh releases every 10 minutes
    setInterval(() => {
      dispatch('refresh')
    }, 10 * 60 * 1000)
  },

  setEvents ({ commit }) {
    ipcRenderer.on(eventsList.latest.success, (e, data) => {
      handlers.get.success(commit, data)
    })

    ipcRenderer.on(eventsList.latest.error, (e, msg) => {
      handlers.get.error(commit, msg)
    })
  }
}
