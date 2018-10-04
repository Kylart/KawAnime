import { axios, log, isRoot } from 'store/utils'

export default {
  async init ({ rootState, commit, dispatch }) {
    console.log('[INIT] Seasons')

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

    dispatch('refresh')
  },
  async refresh ({ rootState, state, commit, dispatch }) {
    if (!rootState.isConnected) {
      log('Cancelling season update, user is offline.')
      setTimeout(() => { dispatch('refresh') }, 20 * 1000)
      return
    }

    commit('refreshing', true)

    const { year, season } = state

    if (year >= 1917 && (year <= (new Date()).getYear() + 1901)) {
      const { data, status } = await axios.get('seasons.json', {
        params: { year, season }
      })

      if (status !== 200) {
        log('Could not refresh seasonal information.')
        setTimeout(() => { dispatch('refresh') }, 60 * 1000)
        commit('refreshing', false)
        return
      }

      commit('set', data)
      commit('refreshing', false)
      log('Seasons refreshed.')
    } else {
      commit('setInfoSnackbar', `Year must be between 1917 and ${(new Date()).getYear() + 1901}`, isRoot)
    }
  }
}
