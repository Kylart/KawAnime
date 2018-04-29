import {axios, log, isRoot} from 'store/utils'

export default {
  async init ({rootState, state, commit, dispatch}) {
    if (!rootState.isConnected) {
      setTimeout(() => {
        dispatch('init')
      }, 30 * 1000)

      return
    }

    console.log('[INIT] Releases')

    try {
      const {data, status} = await axios.get('getLatestNyaa', { params: state.params })

      if (status === 200) {
        commit('set', {data})

        if (state.autoRefresh === true) dispatch('autoRefresh')
      } else if (status === 202) {
        log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
        commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.', isRoot)
        setTimeout(() => {
          log(`Retrying to get latest releases.`)
          dispatch('init').catch(err => { void (err) })
        }, 45 * 1000)
      } else if (status === 204) {
        log('nyaa.si does not respond... Switching to nyaa.pantsu.cat.')

        commit('setChoice', 'pantsu')

        const {data, status} = await axios.get('getLatestNyaa', { params: state.params })

        if (status === 200) {
          commit('set', {data})

          dispatch('news/init', null, isRoot)

          if (state.autoRefresh === true) dispatch('autoRefresh')
        } else if (status === 202) {
          log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
          commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.', isRoot)
          setTimeout(() => {
            log(`Retrying to get latest releases.`)
            dispatch('init').catch(err => { void (err) })
          }, 45 * 1000)
        } else if (status === 204) {
          log('nyaa.pantsu.cat does not respond... Switching to HorribleSubs.')

          commit('setChoice', 'si')

          const {data, status} = await axios.get(`getLatest.json?quality=${state.params.quality}`)

          if (status === 200) {
            commit('set', {data})

            if (state.autoRefresh === true) dispatch('autoRefresh')
          } else if (status === 202) {
            log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
            commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.', isRoot)
            setTimeout(() => {
              log(`Retrying to get latest releases.`)
              dispatch('init').catch(err => { void (err) })
            }, 45 * 1000)
          } else if (status === 204) {
            log('HorribleSubs does not respond. Retrying with nyaa.si...')

            dispatch('init')
          }
        }
      }
    } catch (e) {
      log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
      commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.', isRoot)
      setTimeout(() => {
        log(`Retrying to get latest releases.`)
        dispatch('init').catch(err => { void (err) })
      }, 45 * 1000)
    }
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

      if (status === 200) commit('set', {data})
      else if (status === 202) {
        retryLater(backUp)
      } else if (status === 204) {
        const {data, status} = await axios.get(`getLatest.json?quality=${state.params.quality}`)

        if (status === 200) commit('set', {data})
        else if (status === 202 || status === 204) {
          retryLater(backUp)
        }
      }
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
