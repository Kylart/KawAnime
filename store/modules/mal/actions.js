import {axios, log, isRoot} from '../../utils'

export default {
  async init ({rootState, commit, dispatch}) {
    const {malUsername} = rootState.config.config

    if (malUsername) {
      try {
        await dispatch('initApi', malUsername)
        log(`MyAnimeList > Logged in as ${malUsername}.`)

        await dispatch('getWatchLists', malUsername)
      } catch (e) {
        log('MyAnimeList >', e)
        commit('setInfoSnackbar', 'Error while instantiating MyAnimeList services. Please reset your account or try restarting KawAnime.', isRoot)
      }
    }
  },
  async setupAccount ({rootState, commit, dispatch, state}, credentials) {
    try {
      const {status} = await axios.post('_setupAccount', {
        service: state.service,
        credentials
      })

      if (status === 204) throw new Error('Error while registering service.')

      const {username} = credentials
      rootState.config.config.malUsername = username

      await dispatch('init', username)
    } catch (e) {
      log('MyAnimeList >', e)
      commit('setInfoSnackbar', 'An unknown error occurred. Please restart KawAnime and try again.', isRoot)
    }
  },
  async initApi ({commit}, username) {
    try {
      const {status} = await axios.post('_initOfficalApi', {
        username
      })

      if (status === 204) throw new Error('Error while registering service.')
      if (status === 206) throw new Error('Invalid credentials.')

      log('MyAnimeList > Successfully instanciated API.')
    } catch (e) {
      log('MyAnimeList >', e)
      const isInvalid = e.message === 'Invalid credentials.'
      commit('setInfoSnackbar',
        isInvalid
          ? 'Invalid username or password'
          : 'An unknown error occurred. Please restart KawAnime and try again.',
        isRoot
      )
    }
  },
  async getWatchLists ({state, commit}, user) {
    try {
      commit('isLoading', true)

      const {data} = await axios.get('getWatchList', {params: {user}})

      commit('isLoading', false)
      commit('setWatchLists', data)
    } catch (e) {
      log('MyAnimeList >', e)
    }
  },
  async actOnList ({rootState, commit}, data) {
    try {
      const {status} = await axios.post('actOnMalList', data)

      if (status === 204) throw new Error('Invalid request.')

      commit('setInfoSnackbar', `Entry successfully ${data.type.action === 'delete' ? 'deleted from' : 'entered to'} MyAnimeList!`, isRoot)
    } catch (e) {
      log('MyAnimeList >', e)
      commit('setInfoSnackbar', 'An unknown error occurred. Please try again later.', isRoot)
    }
  }
}
