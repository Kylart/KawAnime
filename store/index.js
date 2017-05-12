// noinspection NpmUsedModulesInstalled
import Vue from 'vue'
// noinspection NpmUsedModulesInstalled
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const log = (message) => {
  console.log(`[${(new Date()).toLocaleTimeString()}]: ${message}`)
}

const store = new Vuex.Store({
  state: {
    releaseFansub: '',
    releaseQuality: '',
    releases: [],
    releasesUpdateTime: (new Date()).toLocaleTimeString(),
    errorSnackbar: {
      show: false,
      text: ''
    },
    downloaderList: [],
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
    historyModal: false
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

      state.config = config
    },
    setDownloaderList (state, data) {
      state.downloaderList = data
      log(`${data.length} anime name loaded.`)
    },
    setErrorSnackbar (state, data) {
      state.errorSnackbar.text = data
      state.errorSnackbar.show = true
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
    setReleasesUpdateTime (state, data) {
      state.releasesUpdateTime = data
    },
    updateList (state, data) {
      const listName = data.listName

      console.log('received ')
      console.log(data)

      state.watchLists[listName].push(data.entry)
      state.watchLists[listName].sort()

      log(`${listName} list updated.`)
    }
  },
  actions: {
    async init ({commit, dispatch}) {
      console.log('[SERVER INIT]')
      const {data} = await axios.get('getConfig.json')
      commit('init', data.config)

      dispatch('downloaderInit').catch(err => { void (err) })
      dispatch('releasesInit').catch(err => { void (err) })
      dispatch('seasonsInit').catch(err => { void (err) })
      dispatch('newsInit').catch(err => { void (err) })
      dispatch('localInit').catch(err => { void (err) })
      dispatch('listInit').catch(err => { void (err) })
      dispatch('getHistory').catch(err => { void (err) })
    },
    async downloaderInit ({commit}) {
      const {data} = await axios.get('getAllShows.json')

      commit('setDownloaderList', data)
    },
    async releasesInit ({state, commit, dispatch}) {
      console.log('[INIT] Releases')

      const {data, status} = await axios.get(`getLatest.json?quality=${state.releaseQuality}`)

      if (status === 200) commit('setReleases', data)
      else if (status === 204) {
        log(`An error occurred while getting the latest releases. Retrying in 30 seconds.`)
        commit('setErrorSnackbar', 'Could not get the latest releases. Retrying in 30 seconds.')
        setTimeout(function () {
          log(`Retrying to get latest releases.`)
          dispatch('refreshReleases').catch(err => { void (err) })
        }, 30 * 1000)
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

      const {data, status} = await axios.get(`getLatest.json?quality=${state.releaseQuality}`)

      if (status === 200) commit('setReleases', data)
      else if (status === 204) {
        log(`An error occurred while getting the latest releases. Retrying in 30 seconds.`)
        commit('setErrorSnackbar', 'Could not get the latest releases. Retrying in 30 seconds.')
        setTimeout(function () {
          log(`Retrying to get latest releases.`)
          dispatch('refreshReleases').catch(err => { void (err) })
        }, 30 * 1000)
      }
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
      const name = state.downloaderForm.name.replace(' ', '_')
      const fromEp = state.downloaderForm.fromEp !== ''
          ? state.downloaderForm.fromEp
          : 0
      const untilEp = state.downloaderForm.untilEp !== ''
          ? state.downloaderForm.untilEp
          : 20000
      const quality = state.downloaderForm.quality

      const magnets = state.config.magnets

      log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

      const {data, status} = await axios.post('download', {
        name: name.replace('_', ' '),
        quality: quality,
        fromEp: fromEp,
        untilEp: untilEp
      })

      state.downloaderForm.loading = false

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
      }
    },
    saveConfig ({}, data) {  // eslint-disable-line
      axios.post('saveConfig', JSON.stringify(data)).then((res) => {
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
    }
  }
})

store.dispatch('init').catch(err => { void (err) })

export default store
