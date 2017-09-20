/**
 * Created by Kylart on 26/07/2017.
 */

import {axios} from './utils'

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
  async getEnv ({commit}) {
    const {data} = await axios.get('_env')

    commit('setEnv', data)
  },
  async openInBrowser () {
    await axios.get('/_openInBrowser')
  }
}
