import {axios, log, isRoot} from '../../utils'

export default {
  async check ({state, commit, dispatch}) {
    setTimeout(async () => {
      if (!state.isAvailable) {
        try {
          const {data} = await axios.get('_isUpdateAvailable')
          if (data.ok) {
            dispatch('isInstallable')
            log('An update is available.')
          }
        } catch (e) {
          log(`Error while checking update. ${e.message}`)
        }

        setTimeout(() => { dispatch('check') }, 30 * 1000)
      }
    }, 30 * 1000)
  },
  async isInstallable ({commit, dispatch}) {
    try {
      const {data} = await axios.get('_isInstallable')
      if (data.ok) {
        commit('setStatus')
        commit('setInfoSnackbar', 'Update available. Think about installing it~', isRoot)
      } else {
        setTimeout(() => { dispatch('isInstallable') }, 1000)
      }
    } catch (e) {
      log(`Error while checking if downloadable. ${e.message}`)
    }
  },
  async updateApp ({commit}) {
    try {
      await axios.get('_quitAndInstall')
    } catch (e) {
      commit('setInfoSnackbar', 'An error occurred, please try again later or try restarting KawAnime and retry.', isRoot)
    }
  }
}
