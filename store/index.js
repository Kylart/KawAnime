// noinspection NpmUsedModulesInstalled
import Vue from 'vue'
// noinspection NpmUsedModulesInstalled
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

let started = false

const log = (message) => {
  console.log(`[${(new Date()).toLocaleTimeString()}]: ${message}`)
}

const store = new Vuex.Store({
  state: {
    autoRefreshReleases: true,
    releaseFansub: '',
    releaseQuality: '',
    releases: [],
    releasesUpdateTime: (new Date()).toLocaleTimeString(),
    releaseParams: {
      fansub: '',
      quality: '',
      choice: 'si'
    },
    infoSnackbar: {
      show: false,
      text: ''
    },
    downloaderForm: {
      name: '',
      fromEp: '',
      untilEp: '',
      quality: '',
      loading: false
    },
    downloaderModal: {
      show: false,
      title: '',
      text: ''
    },
    seasons: [],
    seasonsStats: {},
    year: 2017,
    season: 'spring',
    news: [],
    inside: true,
    localFiles: [],
    watchLists: {
      watchList: [],
      watching: [],
      seen: []
    },
    config: {},
    configDir: '',
    currentDir: '',
    searchInputModal: false,
    searchInput: '',
    searchInfo: {},
    history: {},
    historyModal: false,
    infoModal: false,
    info: {}
  },
  mutations: {
    init (state, data) {
      const config = data
      config.inside = config.inside.toString()

      // config file looks like this
      // const config = {
      //   fansub: 'HorribleSubs',
      //   quality: '720p',
      //   sound: 'Nyanpasu',
      //   localPath: join(userInfo().homedir, 'Downloads'),
      //   inside: true,
      //   magnets: false
      // }

      state.releaseFansub = config.fansub
      state.releaseQuality = config.quality
      state.downloaderForm.quality = config.quality
      state.configDir = config.localPath
      state.currentDir = config.localPath

      state.releaseParams.fansub = config.fansub
      state.releaseParams.quality = config.quality

      state.config = config
    },
    setReleaseParams (state, data) {
      state.releaseParams = data
    },
    setInfoSnackbar (state, data) {
      state.infoSnackbar.text = data
      state.infoSnackbar.show = true
    },
    setCurrentSeason (state, data) {
      state.year = data.year
      state.season = data.season
    },
    setSeasons: function (state, data) {
      state.seasons = data.info
      state.seasonsStats = data.stats
      log(`Seasons set.`)
    },
    emptySeasons: function (state) {
      state.seasons = []
    },
    emptyReleases: function (state) {
      state.releases = []
    },
    setReleases: function (state, data) {
      state.releases = data
      log(`Releases updated.`)
    },
    emptyNews: function (state) {
      state.news = []
    },
    setNews: function (state, data) {
      state.news = data
      log(`News updated.`)
    },
    emptyLocals: function (state) {
      state.localFiles = []
    },
    setLocalFiles: function (state, data) {
      state.localFiles = data
      log(`Local files updated.`)
    },
    setCurrentDir: function (state, data) {
      state.currentDir = data
      log(`Current directory now is ${state.currentDir}.`)
    },
    setWatchLists: function (state, data) {
      state.watchLists = data
      log('Updated watch lists.')
    },
    setConfigDir: function (state, data) {
      state.configDir = data
      log(`Config directory now is ${state.currentDir}`)
    },
    setDownloaderValues: function (state, data) {
      state.downloaderForm = data
    },
    setQuality: function (state, quality) {
      state.downloaderForm.quality = quality
    },
    setDownloaderModal: function (state, data) {
      state.downloaderModal = data
    },
    showDownloaderModal: function (state, value) {
      state.downloaderModal.show = value
    },
    setConfig: function (state, data) {
      state.config = data
    },
    setHistory: function (state, data) {
      state.history = data
      log(`History updated.`)
    },
    setHistoryModal: function (state, data) {
      state.historyModal = data
    },
    setInfoModal: function (state, data) {
      state.infoModal = data
    },
    setInfoModalInfo: function (state, data) {
      state.info = data
    },
    setReleasesUpdateTime (state, data) {
      state.releasesUpdateTime = data
    },
    updateList (state, data) {
      const listName = data.listName
      const entry = data.entry

      if (!state.watchLists[listName].includes(entry)) {
        state.watchLists[listName].push(entry)
        state.watchLists[listName].sort()

        log(`${listName} list updated.`)
        state.infoSnackbar.text = `${entry} was added to your «${listName}» list.`
        state.infoSnackbar.show = true
      } else {
        // Displays error message
        state.infoSnackbar.text = `${entry} is already in your «${listName}» list.`
        state.infoSnackbar.show = true
      }
    },
    removeFromList (state, data) {
      const listName = data.listName
      const index = state.watchLists[listName].indexOf(data.entry)

      state.watchLists[listName].splice(index, 1)
    }
  },
  actions: {
    async init ({commit, dispatch}) {
      if (!started) {
        started = true
        console.log('[SERVER INIT]')
        const {data} = await axios.get('getConfig.json')
        commit('init', data.config)

        dispatch('releasesInit').catch(err => { void (err) })
        dispatch('seasonsInit').catch(err => { void (err) })
        // dispatch('newsInit').catch(err => { void (err) })
        dispatch('localInit').catch(err => { void (err) })
        dispatch('listInit').catch(err => { void (err) })
        dispatch('getHistory').catch(err => { void (err) })
      }
    },
    async releasesInit ({state, commit, dispatch}) {
      // TODO refactor this since it is a bit hard coded
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
          commit('setReleaseParams', {
            fansub: state.config.fansub,
            quality: state.config.quality,
            choice: 'si'
          })

          const {data, status} = await axios.get(`getLatest.json?quality=${state.config.quality}`)

          if (status === 200) {
            commit('setReleases', data)

            if (state.autoRefreshReleases === true) dispatch('autoRefreshReleases')
          } else if (status === 202 || status === 204) {
            log(`An error occurred while getting the latest releases. Retrying in 45 seconds.`)
            commit('setInfoSnackbar', 'Could not get the latest releases. Retrying in 45 seconds.')
            setTimeout(function () {
              log(`Retrying to get latest releases.`)
              dispatch('releasesInit').catch(err => { void (err) })
            }, 45 * 1000)
          }
        }
      }
    },
    async seasonsInit ({state, commit}) {
      console.log('[INIT] Seasons')
      const {data} = await axios.get(`seasons.json?year=${state.year}&season=${state.season}`)

      commit('setSeasons', data)
    },
    async newsInit ({commit}) {
      console.log('[INIT] News')
      const {data} = await axios.get('news.json')

      commit('setNews', data)
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

        const {data} = await axios.get('getLatestNyaa', { params: state.releaseParams })

        if (data.length === 18) {
          // Update time whenever KawAnime receives new releases.
          const newTime = (new Date()).toLocaleTimeString()
          this.$store.commit('setReleasesUpdateTime', newTime)

          commit('setReleases', data)
          dispatch('autoRefreshReleases')
        } else {
          const {data} = await axios.get(`getLatest.json?quality=${state.releaseQuality}`)

          if (data.length === 18) {
            // Update time whenever KawAnime receives new releases.
            const newTime = (new Date()).toLocaleTimeString()
            this.$store.commit('setReleasesUpdateTime', newTime)

            commit('setReleases', data)
            dispatch('autoRefreshReleases')
          }
        }
      }, 30 * 60 * 1000)
    },
    async refreshSeasons ({state, commit}) {
      log(`Refreshing Seasons...`)

      commit('emptySeasons')

      const year = state.year
      const season = state.season
      const {data} = await axios.get(`seasons.json?year=${year}&season=${season}`)
      commit('setSeasons', data)

      console.log('Seasons refreshed.')
    },
    async refreshNews ({commit}) {
      log(`Refreshing News...`)

      commit('emptyNews')

      const {data} = await axios.get('news.json')

      commit('setNews', data)
    },
    async refreshLocal ({commit, state}) {
      log(`Refreshing Local files...`)

      const {data} = await axios.get(`local.json?dir=${state.currentDir}`)

      commit('setLocalFiles', data)
    },
    async resetLocal ({state}) {
      log(`Resetting local information...`)

      axios.get(`resetLocal?dir=${state.currentDir}`).then(() => {
        log(`Reset completed.`)
      }).catch((err) => {
        log('An error occurred while resetting.\n' + err)
      })
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
      log(`Opening a link`)

      if ((state.config.inside === 'true') === false) await axios.get(`openThis?type=link&link=${link}`)
      else await axios.get(`openThis?type=insideLink&link=${link}`)
    },
    async download ({state, commit}) {
      const name = state.downloaderForm.name
      const fromEp = state.downloaderForm.fromEp !== ''
          ? state.downloaderForm.fromEp
          : 0
      const untilEp = state.downloaderForm.untilEp !== ''
          ? state.downloaderForm.untilEp
          : 20000
      const quality = state.downloaderForm.quality

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
    saveConfig ({}, data) {  // eslint-disable-line
      axios.post('saveConfig', JSON.stringify({
        config: data
      })).then((res) => {
        if (res.status === 200) { log(`Successfully updated config!`) }
      }).catch((err) => {
        log(`An error occurred while saving config: ${err}`)
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
    async openInBrowser () {
      const {data} = await axios.get('/_openInBrowser')
      log(`Opening KawAnime in browser at ${data.uri}.`)
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
    }
  }
})

store.dispatch('init').catch(err => { void (err) })

export default store
