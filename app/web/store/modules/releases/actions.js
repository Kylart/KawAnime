import { axios, log } from 'store/utils'

export default {
  async init ({ dispatch }) {
    log('[INIT] Releases')
    await dispatch('refresh')
    await dispatch('autoRefresh')
  },
  async refresh ({ rootState, state, commit, dispatch }) {
    if (!rootState.isConnected) {
      log('Cancelling feed update, user is offline.')
      setTimeout(() => {
        dispatch('refresh')
      }, 2 * 60 * 1000)
      return
    }

    commit('refreshing', true)

    const { data, status } = await axios.get('getLatest', {
      params: state.params
    })

    if (status === 204) {
      // This most likely mean that the user is offline.
      log('An error has occurred while getting latest releases. Has the system access to the internet?')
      setTimeout(() => {
        dispatch('refresh')
      }, 1 * 60 * 1000)
      return
    }

    commit('set', data)
    commit('refreshing', false)
  },
  autoRefresh ({ dispatch }) {
    // Refresh releases every 10 minutes
    setInterval(() => {
      dispatch('refresh')
    }, 10 * 60 * 1000)
  }
}
