import { axios, log, isRoot, _ } from 'store/utils'

export default {
  async init ({ rootState, state, commit, dispatch }) {
    const { data, status } = await axios.get(`${state.service}/credentials`, {
      params: { service: state.service }
    })

    if (!rootState.isConnected || status === 204) {
      setTimeout(() => {
        dispatch('init')
      }, 60 * 1000)

      return
    }

    commit('setCredentials', data)

    if ('username' in data && data.username) {
      try {
        await dispatch('initApi')

        await dispatch('getWatchLists', data.username)
      } catch (e) {
        log('MyAnimeList >', e)
        commit(
          'setInfoSnackbar',
          'Error while instantiating MyAnimeList services. Please reset your account or try restarting KawAnime.',
          isRoot
        )
      }
    }
  },
  async setupAccount ({ rootState, commit, dispatch, state }, credentials) {
    try {
      const { status } = await axios.post('_setupAccount', {
        service: state.service,
        credentials
      })

      if (status === 204) throw new Error('Error while registering service.')

      const { username } = credentials

      await dispatch('init', username)
    } catch (e) {
      log('MyAnimeList >', e)
      commit('setInfoSnackbar', 'An unknown error occurred. Please restart KawAnime and try again.', isRoot)
    }
  },
  async initApi ({ state, commit }) {
    const { username } = state.credentials

    try {
      const { status } = await axios.post('_initOfficalApi', {
        service: state.service
      })

      if (status === 204) throw new Error('Problem encountered while registering service.')
      if (status === 206) throw new Error('Invalid credentials.')

      log('MyAnimeList > Successfully instanciated API.')
      log(`MyAnimeList > Logged in as ${username}.`)
    } catch (e) {
      log('MyAnimeList >', e.message)
      const isInvalid = e.message === 'Invalid credentials.'
      commit('setInfoSnackbar',
        isInvalid
          ? 'Invalid username or password.'
          : 'An unknown error occurred with MAL API.',
        isRoot
      )
    }
  },
  async getWatchLists ({ state, commit }, user) {
    try {
      commit('isLoading', true)

      const { data } = await axios.get('getWatchList', { params: { user } })

      if (!data) return

      commit('isLoading', false)
      commit('setWatchLists', _.map(data, (obj) => {
        obj.id = +obj.id
        obj.score = +obj.score
        obj.nbEpisodes = +obj.nbEpisodes
        obj.nbWatchedEpisode = +obj.nbWatchedEpisode
        obj.status = +obj.status

        return obj
      }))
      log('MyAnimeList > Watch lists loaded.')
      commit('setCustomTags')
    } catch (e) {
      log('MyAnimeList >', e)
    }
  },
  async actOnList ({ state, commit, dispatch }, data) {
    try {
      const { status } = await axios.post('actOnMalList', data)

      if (status === 204) throw new Error('Invalid request.')

      commit('setInfoSnackbar', `Entry successfully ${data.type.action === 'delete' ? 'deleted from' : 'entered to'} MyAnimeList!`, isRoot)
      dispatch('getWatchLists', state.username)
    } catch (e) {
      log('MyAnimeList >', e)
      commit('setInfoSnackbar', 'An unknown error occurred. Please try again later.', isRoot)
    }
  }
}
