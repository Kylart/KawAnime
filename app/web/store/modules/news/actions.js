import { axios, log } from 'store/utils'

export default {
  init ({ dispatch }) {
    console.log('[INIT] News')
    dispatch('refresh')
    dispatch('autoRefresh')
  },
  async refresh ({ rootState, state, commit, dispatch }) {
    if (!rootState.isConnected) {
      log('Cancelling news update, user is offline.')
      setTimeout(() => { dispatch('refresh') }, 5 * 60 * 1000)
      return
    }

    commit('setRefreshing', true)

    const { data, status } = await axios.get('news', {
      params: {
        feed: state.feed
      }
    })

    if (status !== 200) {
      log('Error while updating anime news.')
      setTimeout(() => { dispatch('refresh') }, 5 * 60 * 1000)
    }

    commit('set', data)
    commit('setRefreshing', false)
  },
  async autoRefresh ({ dispatch }) {
    // Auto refresh every 30 minutes should be enough
    setInterval(
      () => { dispatch('refresh') },
      30 * 60 * 1000
    )
  }
}
