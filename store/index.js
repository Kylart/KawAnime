import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

Vue.use(Vuex)

let started = false

const log = (message) => {
  console.log(`[${(new Date()).toLocaleTimeString()}]: ${message}`)
}

const store = new Vuex.Store({
  state: {
    platform: '',
    drawer: false,
    autoRefreshReleases: true,
    releaseFansub: '',
    releaseQuality: '',
    releases: [],
    releasesUpdateTime: moment(),
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
    year: 0,
    season: '',
    news: [],
    localFiles: [],
    resettingLocal: false,
    refreshingLocal: false,
    watchLists: {
      watchList: [],
      watching: [],
      seen: [],
      onHold: [],
      dropped: []
    },
    config: {},
    configDir: '',
    searchInputModal: false,
    searchInput: '',
    searchInfo: {},
    history: {},
    historyModal: false,
    infoModal: false,
    info: {},
    addToChoice: false
  },
  mutations: {
    setPlatform (state, data) {
      state.platform = data
    },
    init (state, data) {
      const config = data
      config.inside = config.inside.toString()

      // config file looks like this
      // const config = {
      //   fansub: 'HorribleSubs',
      //   quality: '720p',
      //   localPath: join(userInfo().homedir, 'Downloads'),
      //   inside: true,
      //   magnets: false
      // }

      state.releaseFansub = config.fansub
      state.releaseQuality = config.quality
      state.downloaderForm.quality = config.quality
      state.currentDir = config.localPath

      state.releaseParams.fansub = config.fansub
      state.releaseParams.quality = config.quality

      state.config = config
    },
    toggleDrawer (state) {
      state.drawer = !state.drawer
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
      state.releasesUpdateTime = moment()

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
    setResettingLocal: function (state) {
      state.resettingLocal = !state.resettingLocal
    },
    setRefreshingLocal: function (state) {
      state.refreshingLocal = !state.refreshingLocal
    },
    updateLocalFiles: function (state, data) {
      if (data.type === 'delete') {
        const index = state.localFiles.findIndex((file) => file.path === data.path)

        state.localFiles.splice(index, 1)
      }
    },
    setWatchLists: function (state, data) {
      state.watchLists = data
      log('Updated watch lists.')
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
    setConfigDir: function (state, data) {
      state.config.localPath = data
      log(`Config directory now is ${state.currentDir}`)
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
    updateList (state, data) {
      const lists = {
        watchList: 'Watch list',
        onHold: 'On Hold'
      }

      const listName = data.listName
      const logListName = lists[data.listName] || listName
      const entry = data.entry

      if (!state.watchLists[listName].includes(entry)) {
        state.watchLists[listName].push(entry)
        state.watchLists[listName].sort()

        log(`${listName} list updated.`)
        state.infoSnackbar.text = `${entry} was added to your «${logListName}» list.`
        state.infoSnackbar.show = true
      } else {
        // Displays error message
        state.infoSnackbar.text = `${entry} is already in your «${logListName}» list.`
        state.infoSnackbar.show = true
      }
    },
    removeFromList (state, data) {
      const listName = data.listName
      const index = state.watchLists[listName].indexOf(data.entry)

      state.watchLists[listName].splice(index, 1)
    },
    setAddToChoice (state, data) {
      state.addToChoice = data
    }
  },
  actions: {
    nuxtServerInit ({commit}, {env}) {
      commit('setPlatform', env.platform)
    },
    async init ({commit, dispatch}) {
      if (!started) {
        started = true
        console.log('[SERVER INIT]')
        const {data} = await axios.get('getConfig.json')
        commit('init', data.config)

        dispatch('releasesInit').catch(err => { void (err) })
        dispatch('seasonsInit').catch(err => { void (err) })
        dispatch('newsInit').catch(err => { void (err) })
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
    async seasonsInit ({commit}) {
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

      const {data} = await axios.get(`seasons.json?year=${year}&season=${season}`)

      commit('setSeasons', data)
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

        const {data} = await axios.get('getLatestNyaa', { params: state.releaseParams })

        if (data.length === 18) {
          commit('setReleases', data)
          dispatch('autoRefreshReleases')
        } else {
          const {data} = await axios.get(`getLatest.json?quality=${state.releaseQuality}`)

          if (data.length === 18) {
            commit('setReleases', data)
            dispatch('autoRefreshReleases')
          }
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
