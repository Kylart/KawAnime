/**
 * Created by Kylart on 26/07/2017.
 */

import {axios, log} from './utils'

export default {
  async init ({commit, dispatch}) {
    // Offline
    try {
      const {data} = await axios.get('getConfig.json')

      commit('config/set', data.config)

      // Setting defaults
      commit('downloader/setQuality', data.config.quality)
      commit('releases/setParams', {
        fansub: data.config.fansub,
        quality: data.config.quality,
        choice: 'si'
      })
      commit('localFiles/setDir', data.config.localPath)
    } catch (e) { void e }

    dispatch('getEnv').catch(err => { void err })
    dispatch('localFiles/init').catch(err => { void err })
    dispatch('watchLists/init').catch(err => { void err })
    dispatch('history/get').catch(err => { void err })
    dispatch('player/setUp').catch(err => { void err })

    // Online
    try {
      const {status} = await axios.get('_isOnline')
      if (status === 200) {
        commit('setConnected', true)
        dispatch('online')
      } else {
        commit('setInfoSnackbar', 'No internet access. Retrying in 1 minutes.')
        setTimeout(() => { dispatch('online') }, 60 * 1000)
      }
    } catch (e) { void e }
  },
  async online ({dispatch}) {
    dispatch('releases/init').catch(err => { void err })
    dispatch('seasons/init').catch(err => { void err })
    dispatch('news/init').catch(err => { void err })
  },
  async checkUpdate ({state, commit, dispatch}) {
    setTimeout(async () => {
      if (!state.isUpdateAvailable) {
        try {
          const {data} = await axios.get('_isUpdateAvailable')
          if (data.ok) {
            dispatch('isUpdateInstallable')
            log('An update is available.')
          }
        } catch (e) {
          log(`Error while checking update. ${e.message}`)
        }

        setTimeout(() => { dispatch('checkUpdate') }, 30 * 1000)
      }
    }, 30 * 1000)
  },
  async isUpdateInstallable ({commit, dispatch}) {
    try {
      const {data} = await axios.get('_isInstallable')
      if (data.ok) {
        commit('setUpdateStatus')
        commit('setInfoSnackbar', 'Update available. Think about installing it~')
      } else {
        setTimeout(() => { dispatch('_isInstallable') }, 1000)
      }
    } catch (e) {
      log(`Error while checking if downloadable. ${e.message}`)
    }
  },
  async updateApp ({commit}) {
    try {
      await axios.get('_quitAndInstall')
    } catch (e) {
      commit('setInfoSnackbar', 'An error occurred, please try again later or try restarting KawAnime and retry.')
    }
  },
  async getEnv ({commit}) {
    const {data} = await axios.get('_env')

    commit('setEnv', data)
  },
  async openInBrowser () {
    await axios.get('/_openInBrowser')
  },
  async searchInfoFromName ({commit, state}, name) {
    if (name === state.info.term) {
      commit('showInfo', true)
    } else {
      commit('setInfoTerm', name)
      commit('setInfoLoading', true)
      commit('showInfo', true)
      const {data, status} = await axios.get(`getInfoFromMal?term=${name}`)

      commit('setInfoLoading', false)

      status === 200
        ? commit('setInfo', data)
        : commit('setInfoError', `An error occurred while retrieving information of ${name}..`)
    }
  }
}
