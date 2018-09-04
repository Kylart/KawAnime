import {axios, log} from 'store/utils'

export default {
  async init ({dispatch}) {
    log('[INIT] Releases')
    dispatch('refresh')
    dispatch('autoRefresh')
  },
  async refresh ({state, commit}) {
    const { data, status } = await axios.get('getLatest', {
      params: {
        fansub: state.params.fansub,
        quality: state.params.quality,
        feed: state.params.choice
      }
    })

    if (status === 204) {
      log('An error has occurred while getting latest releases.')
      return
    }

    commit('set', data)
  },
  autoRefresh ({dispatch}) {
    // Refresh releases every 10 minutes
    setInterval(() => {
      dispatch('refresh')
    }, 10 * 60 * 1000)
  }
}
