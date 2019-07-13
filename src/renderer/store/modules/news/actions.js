import { ipcRenderer, log } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init  ({ dispatch }) {
    dispatch('setEvents')
    dispatch('autoRefresh')
  },
  refresh ({ rootState, state, commit }) {
    if (!rootState.isConnected) {
      log('Cancelling news update, user is offline.')
      return
    }

    const provider = rootState.config.config.infoProvider.news

    commit('setRefreshing', true)

    ipcRenderer.send(eventsList.news.main, {
      feed: state.feed,
      provider
    })
  },
  autoRefresh ({ dispatch }) {
    // Auto refresh every 15 minutes should be enough
    setInterval(
      () => { dispatch('refresh') },
      15 * 60 * 1000
    )
  },

  setEvents ({ commit }) {
    ipcRenderer.on(eventsList.news.success, (e, data) => {
      handlers.success(commit, data)
    })

    ipcRenderer.on(eventsList.news.error, (e, msg) => {
      handlers.error(commit, msg)
    })
  }
}
