/**
 * Created by Kylart on 26/07/2017.
 */

import {axios, log} from './utils'

export default {
  async init ({commit, dispatch}) {
    // Offline
    try {
      const {data} = await axios.get('getConfig.json')
      commit('init', data.config)
      // commit('config/set', data.config)

      // Setting defaults
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
    dispatch('getHistory').catch(err => { void err })
    dispatch('setUpPlayer').catch(err => { void err })

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
  setUpPlayer ({state}) {
    try {
      const sound = state.config.config.sound
      document.player = new window.Audio()
      document.player.src = `static/sounds/${sound}.m4a`
      document.player.volume = 0.5
    } catch (e) { void e }
  },
  playSound () {
    if (!document.player.src.includes('sounds/None.m4a')) {
      document.player.currentTime = 0
      document.player.play()
    }
  },
  async download ({state, commit}, obj = {}) {
    const isDownloader = obj.isDownloader || true
    const name = obj.name || state.downloaderForm.name
    const fromEp = state.downloaderForm.fromEp !== ''
      ? state.downloaderForm.fromEp
      : 0
    const untilEp = state.downloaderForm.untilEp !== ''
      ? state.downloaderForm.untilEp
      : 20000
    const quality = isDownloader ? state.downloaderForm.quality : state.config.config.quality

    const magnets = state.config.config.magnets

    log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

    const infos = {
      name: name,
      quality: quality,
      fromEp: +fromEp,
      untilEp: +untilEp,
      fansub: state.config.config.fansub,
      choice: 'si'
    }

    const {data, status} = await axios.post('download', infos)

    if (status === 200) {
      log(`Request fulfilled!`)

      if (magnets === true) {
        const lastEp = fromEp !== '1' ? +fromEp + +data.length : data.length
        log(`User says he prefers having magnets hashes.`)
        commit('setDownloaderModal', {
          show: true,
          title: `${name.replace('_', ' ')}\t ${fromEp} - ${lastEp}`,
          text: data
        })
      } else {
        log(`Opening torrents directly on preferred torrent client.`)

        data.forEach((link) => {
          window.open(link)
        })
      }
    } else if (status === 204) {
      log('nyaa.si is down, trying with nyaa.pantsu.cat')

      const {data, status} = await axios.post('download', {
        name: name,
        quality: quality,
        fromEp: fromEp,
        untilEp: untilEp,
        fansub: state.config.fansub,
        choice: 'pantsu'
      })

      if (status === 200) {
        log(`Request fulfilled!`)

        if (magnets === true) {
          const lastEp = fromEp !== '1' ? +fromEp + +data.length : data.length
          log(`User says he prefers having magnets hashes.`)
          commit('setDownloaderModal', {
            show: true,
            title: `${name.replace('_', ' ')}\t ${fromEp} - ${lastEp}`,
            text: data
          })
        } else {
          log(`Opening torrents directly on preferred torrent client.`)

          data.forEach((link) => {
            window.open(link)
          })
        }
      } else {
        log('Unknown error occurred. nyaa.si and nyaa.pantsu.cat seem both down.')

        commit('setInfoSnackbar', 'Sorry. KawAnime was not able to get your torrents...')
      }
    }

    state.downloaderForm.loading = false
  },
  appendHistory ({}, data) {  // eslint-disable-line
    axios.post('appendHistory', JSON.stringify(data)).then(() => {
      log(`Successfully appended to history.`)
    }).catch(err => {
      log(`An error occurred while appending to history... ${err}`)
    })
  },
  async getHistory ({commit}) {
    const {data, status} = await axios.get('getHistory?')

    if (status !== 200) { log(`An error occurred while gathering the history.`) }

    commit('setHistory', data)
  },
  async removeFromHistory ({dispatch}, data) {
    await axios.post('removeFromHistory', JSON.stringify(data))

    dispatch('getHistory')
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
