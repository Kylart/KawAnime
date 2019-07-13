import { ipcRenderer, log, isRoot } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ commit, dispatch }) {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    let season

    if (month > 0 && month < 4) season = 'winter'
    else if (month > 3 && month < 7) season = 'spring'
    else if (month > 6 && month < 10) season = 'summer'
    else if (month > 9 && month < 13) season = 'fall'

    commit('setYear', year)
    commit('setSeason', season)
    dispatch('setEvents')
  },
  refresh ({ rootState, state, commit, dispatch }) {
    if (!rootState.isConnected) {
      log('Cancelling season update, user is offline.')
      setTimeout(() => { dispatch('refresh') }, 20 * 1000)
      return
    }

    commit('refreshing', true)

    const { year, season } = state
    const provider = rootState.config.config.infoProvider.seasons

    if (year >= 1917 && (year <= (new Date()).getYear() + 1901)) {
      ipcRenderer.send(eventsList.seasons.main, { provider, year, season })

      return
    }

    commit('setInfoSnackbar', `Year must be between 1917 and ${(new Date()).getYear() + 1901}`, isRoot)
  },

  setEvents ({ commit, dispatch }) {
    ipcRenderer.on(eventsList.seasons.success, (e, data) => {
      handlers.success(commit, data)
    })

    ipcRenderer.on(eventsList.seasons.error, (e, msg) => {
      handlers.error({ commit, dispatch }, msg)
    })
  }
}
