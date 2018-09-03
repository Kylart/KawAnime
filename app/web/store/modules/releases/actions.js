import {axios, log, isRoot} from 'store/utils'

export default {
  async init ({rootState, state, commit, dispatch}) {
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
  async refresh ({state, rootState, commit, dispatch}) {
    const retryLater = (backUp) => {
      if (!state.notLoaded) {
        log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
        commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.', isRoot)

        backUp.length && commit('set', {old: backUp})

        setTimeout(() => {
          log(`Retrying to get latest releases.`)
          dispatch('refresh').catch(err => { void (err) })
        }, 45 * 1000)
      }
    }

    const backUp = state.releases

    if (!rootState.isConnected) {
      retryLater(backUp)
      return
    }

    log(`Refreshing Releases...`)

    commit('empty')

    try {
      const {data, status} = await axios.get('getLatestNyaa', { params: state.params })

      status === 200
        ? commit('set', {data})
        : retryLater(backUp)
    } catch (e) {
      retryLater(backUp)
    }
  },
  async autoRefresh ({rootState, dispatch, commit, state}) {
    // Refresh releases every 30 minutes
    setTimeout(async () => {
      if (!rootState.isConnected) {
        log('No internet connection.')
        return
      }

      log(`Refreshing Releases...`)

      try {
        const {data} = await axios.get('getLatestNyaa', { params: state.params })

        if (data.length === 18) {
          commit('set', {data})
          dispatch('autoRefresh')
        } else {
          commit('setInfoSnackbar', 'Auto refresh releases failed... Attempting again in 30 minutes.', isRoot)

          dispatch('autoRefresh')
        }
      } catch (e) {
        commit('setInfoSnackbar', 'Auto refresh releases failed... Attempting again in 30 minutes.', isRoot)

        dispatch('autoRefresh')
      }
    }, 30 * 60 * 1000)
  }
}
