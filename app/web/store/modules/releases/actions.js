import {axios, log} from 'store/utils'

export default {
  async init ({dispatch}) {
    log('[INIT] Releases')
    dispatch('refresh')
    dispatch('autoRefresh')
  },
  async refresh ({state, commit}) {
    commit('refreshing', true)

    const { data, status } = await axios.get('getLatest', {
      params: state.params
    })

    if (status === 204) {
      log('An error has occurred while getting latest releases.')
      return
    }

    commit('set', data)
    commit('refreshing', false)
  },
  autoRefresh ({dispatch}) {
    // Refresh releases every 10 minutes
    setInterval(() => {
      dispatch('refresh')
    }, 10 * 60 * 1000)
  }
}
