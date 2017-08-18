/**
 * Created by Kylart on 26/07/2017.
 */

import axios from 'axios'
import {log} from './utils'

export default {
  async init ({commit, dispatch}) {
    // Offline
    try {
      const {data} = await axios.get('getConfig.json')
      commit('init', data.config)
    } catch (e) { void e }

    dispatch('getEnv').catch(err => { void err })
    dispatch('localInit').catch(err => { void (err) })
    dispatch('listInit').catch(err => { void (err) })
    dispatch('getHistory').catch(err => { void (err) })
    dispatch('setUpPlayer').catch(err => { void (err) })

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
    dispatch('releasesInit').catch(err => { void (err) })
    dispatch('seasonsInit').catch(err => { void (err) })
    dispatch('newsInit').catch(err => { void (err) })
  },
  async getEnv ({commit}) {
    const {data} = await axios.get('_env')

    commit('setEnv', data)
  },
  setUpPlayer ({state}) {
    try {
      const sound = state.config.sound
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
  async releasesInit ({state, commit, dispatch}) {
    console.log('[INIT] Releases')

    const {data, status} = await axios.get('getLatestNyaa', { params: state.releaseParams })

    if (status === 200) {
      commit('setReleases', data)

      if (state.autoRefreshReleases === true) dispatch('autoRefreshReleases')
    } else if (status === 202) {
      log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
      commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.')
      setTimeout(function () {
        log(`Retrying to get latest releases.`)
        dispatch('releasesInit').catch(err => { void (err) })
      }, 45 * 1000)
    } else if (status === 204) {
      log('nyaa.si does not respond... Switching to nyaa.pantsu.cat.')

      commit('setReleaseParams', {
        fansub: state.config.fansub,
        quality: state.config.quality,
        choice: 'pantsu'
      })

      const {data, status} = await axios.get('getLatestNyaa', { params: state.releaseParams })

      if (status === 200) {
        commit('setReleases', data)

        if (state.autoRefreshReleases === true) dispatch('autoRefreshReleases')
      } else if (status === 202) {
        log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
        commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.')
        setTimeout(function () {
          log(`Retrying to get latest releases.`)
          dispatch('releasesInit').catch(err => { void (err) })
        }, 45 * 1000)
      } else if (status === 204) {
        log('nyaa.pantsu.cat does not respond... Switching to HorribleSubs.')

        commit('setReleaseParams', {
          fansub: state.config.fansub,
          quality: state.config.quality,
          choice: 'si'
        })

        const {data, status} = await axios.get(`getLatest.json?quality=${state.config.quality}`)

        if (status === 200) {
          commit('setReleases', data)

          if (state.autoRefreshReleases === true) dispatch('autoRefreshReleases')
        } else if (status === 202) {
          log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
          commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.')
          setTimeout(function () {
            log(`Retrying to get latest releases.`)
            dispatch('releasesInit').catch(err => { void (err) })
          }, 45 * 1000)
        } else if (status === 204) {
          log('HorribleSubs does not respond. Retrying with nyaa.si.')

          dispatch('releasesInit')
        }
      }
    }
  },
  async seasonsInit ({commit, dispatch}) {
    console.log('[INIT] Seasons')

    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    let season

    if (month > 0 && month < 4) season = 'winter'
    else if (month > 3 && month < 7) season = 'spring'
    else if (month > 6 && month < 10) season = 'summer'
    else if (month > 9 && month < 13) season = 'fall'

    commit('setCurrentSeason', {year, season})

    try {
      const {data} = await axios.get(`seasons.json?year=${year}&season=${season}`)
      commit('setSeasons', data)
    } catch (e) {
      const msg = 'Error while getting this season data. Retrying in 10 seconds...'
      log(msg)
      commit('setInfoSnackbar', msg)

      setTimeout(() => dispatch('seasonsInit'), 10 * 1000)
    }
  },
  async newsInit ({commit, dispatch}) {
    console.log('[INIT] News')
    const {data, status} = await axios.get('news.json')

    status === 200
      ? commit('setNews', data)
      : log('A problem occurred while gathering the news.') && dispatch('newsInit')
  },
  async localInit ({state, commit}) {
    console.log('[INIT] Local Files')

    const {data} = await axios.get(`local.json?dir=${state.currentDir}`)

    commit('setLocalFiles', data)
  },
  async listInit ({commit}) {
    console.log('[INIT] Watch List')

    const {data} = await axios.get(`watchList.json?`)

    log(`Received watch lists.`)

    commit('setWatchLists', data)
  },
  async refreshReleases ({state, commit, dispatch}) {
    log(`Refreshing Releases...`)

    commit('emptyReleases')

    commit('setReleaseParams', {
      fansub: state.releaseFansub,
      quality: state.releaseQuality,
      choice: state.releaseParams.choice
    })

    const {data, status} = await axios.get('getLatestNyaa', { params: state.releaseParams })

    if (status === 200) commit('setReleases', data)
    else if (status === 202) {
      log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
      commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.')
      setTimeout(function () {
        log(`Retrying to get latest releases.`)
        dispatch('refreshReleases').catch(err => { void (err) })
      }, 45 * 1000)
    } else if (status === 204) {
      const {data, status} = await axios.get(`getLatest.json?quality=${state.releaseQuality}`)

      if (status === 200) commit('setReleases', data)
      else if (status === 202 || status === 204) {
        log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
        commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.')
        setTimeout(function () {
          log(`Retrying to get latest releases.`)
          dispatch('refreshReleases').catch(err => { void (err) })
        }, 45 * 1000)
      }
    }
  },
  async autoRefreshReleases ({dispatch, commit, state}) {
    // Refresh releases every 30 minutes
    setTimeout(async () => {
      log(`Refreshing Releases...`)

      const oldData = state.releases
      const {data} = await axios.get('getLatestNyaa', { params: state.releaseParams })

      if (data.length === 18) {
        commit('setReleases', data)
        dispatch('autoRefreshReleases')
      } else {
        commit('setInfoSnackbar', 'Auto refresh releases failed... Attempting again in 30 minutes.')

        commit('setReleases', oldData)
        dispatch('autoRefreshReleases')
      }
    }, 30 * 60 * 1000)
  },
  async refreshSeasons ({state, commit, dispatch}) {
    log(`Refreshing Seasons...`)

    const year = state.year
    const season = state.season.value || state.season

    if (year >= 2010 && (year <= (new Date()).getYear() + 1901)) {
      commit('emptySeasons')

      const {data, status} = await axios.get(`seasons.json?year=${year}&season=${season}`)

      status === 200
        ? commit('setSeasons', data)
        : dispatch('refreshSeasons')

      log('Seasons refreshed.')
    } else {
      commit('setInfoSnackbar', `Year must be between 2010 and ${(new Date()).getYear() + 1901}`)
    }
  },
  async refreshNews ({commit, dispatch}) {
    log(`Refreshing News...`)

    commit('emptyNews')

    const {data, status} = await axios.get('news.json')

    status === 200
      ? commit('setNews', data)
      : log('A problem occurred while gathering the news.') && dispatch('refreshNews')
  },
  async refreshLocal ({commit, state}) {
    log(`Refreshing Local files...`)

    commit('setRefreshingLocal')

    const {data} = await axios.get(`local.json?dir=${state.currentDir}`)

    commit('setRefreshingLocal')
    commit('setLocalFiles', data)
  },
  async resetLocal ({state, commit, dispatch}) {
    log(`Resetting local information...`)

    commit('setResettingLocal')

    axios.get(`resetLocal?dir=${state.currentDir}`).then(() => {
      dispatch('refreshLocal')
      log(`Reset completed.`)
    }).catch((err) => {
      log('An error occurred while resetting.\n' + err)
    }).then(() => { commit('setResettingLocal') })
  },
  async changePath ({commit, dispatch}) {
    const {data} = await axios.get('openThis?type=dialog')

    commit('emptyLocals')
    commit('setCurrentDir', data.path)
    dispatch('refreshLocal')
  },
  async changePathWithConfig ({commit, dispatch}) {
    const {data} = await axios.get('openThis?type=dialog')

    commit('emptyLocals')
    commit('setCurrentDir', data.path)
    commit('setConfigDir', data.path)
    dispatch('refreshLocal')
  },
  async openNewsLink ({state}, link) {
    log(`Opening ${link}`)

    await axios.get(
      state.config.inside
        ? `openThis?type=insideLink&link=${link}`
        : `openThis?type=link&link=${link}`
    )
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
    const quality = isDownloader ? state.downloaderForm.quality : state.config.quality

    const magnets = state.config.magnets

    log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

    const infos = {
      name: name,
      quality: quality,
      fromEp: +fromEp,
      untilEp: +untilEp,
      fansub: state.config.fansub,
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
        log('Unknown error occurred. nyaa.si and nyaa.pantsu.cat seems both down.')

        commit('setInfoSnackbar', 'Sorry. KawAnime was not able to get your torrents...')
      }
    }

    state.downloaderForm.loading = false
  },
  saveConfig ({commit}, data) {  // eslint-disable-line
    axios.post('saveConfig', JSON.stringify({
      config: data
    })).then((res) => {
      if (res.status === 200) {
        log(`Successfully updated config!`)
        commit('setInfoSnackbar', 'Config saved successfully.')
      }
    }).catch((err) => {
      log(`An error occurred while saving config: ${err}`)
      commit(
        'setInfoSnackbar',
        'An error occurred while saving config. If the problem continues to occur, please restart KawAnime and try again.'
      )
    })
  },
  appendHistory ({}, data) {  // eslint-disable-line
    axios.post('appendHistory', JSON.stringify(data)).then(() => {
      log(`Successfully appended to history.`)
    }).catch((err) => {
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
  async saveWatchList ({state}) {
    axios.post('saveWatchList', JSON.stringify(state.watchLists))
  },
  async updateList ({dispatch, commit}, data) {
    commit('updateList', data)

    dispatch('saveWatchList')
  },
  async removeFromList ({dispatch, commit}, data) {
    commit('removeFromList', data)

    dispatch('saveWatchList')
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
