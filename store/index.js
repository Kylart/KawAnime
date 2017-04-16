//noinspection NpmUsedModulesInstalled
import Vue from 'vue'
//noinspection NpmUsedModulesInstalled
import Vuex from 'vuex'
import axios from 'axios'
import {readFileSync, writeFileSync} from 'fs'
import {join} from 'path'
import {userInfo} from 'os'
import {remote} from 'electron'

// Getting config.
const configPath = join(userInfo().homedir, '.KawAnime', 'config.json')
const configFile = readFileSync(configPath)

const config = JSON.parse(configFile).config

// config file looks like this
// const config = {
//   fansub: 'HorribleSubs',
//   quality: '720p',
//   sound: 'Nyanpasu',
//   localPath: join(userInfo().homedir, 'Downloads'),
//   inside: true,
//   magnets: false
// }

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    releases: [],
    downloaderForm: {
      name: '',
      fromEp: '',
      untilEp: '',
      quality: config.quality,
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
    config: {
      fansub: config.fansub,
      quality: config.quality,
      sound: config.sound,
      inside: config.inside.toString(),
      magnets: config.magnets
    },
    configDir: config.localPath,
    currentDir: config.localPath,
    searchInputModal: false,
    searchInput: '',
    searchInfo: {

    }
  },
  mutations: {
    setCurrentSeason(state, data) {
      state.year = data.year
      state.season = data.season
    },
    setSeasons: function (state, data) {
      state.seasons = data.info
      state.seasonsStats = data.stats
      console.log(`[${(new Date()).toLocaleTimeString()}]: Seasons set.`)
    },
    emptySeasons: function (state) {
      state.seasons = []
    },
    emptyReleases: function (state) {
      state.releases = []
    },
    setReleases: function (state, data) {
      state.releases = data
      console.log(`[${(new Date()).toLocaleTimeString()}]: Releases updated.`)
    },
    emptyNews: function (state) {
      state.news = []
    },
    setNews: function (state, data) {
      state.news = data
      console.log(`[${(new Date()).toLocaleTimeString()}]: News updated.`)
    },
    emptyLocals: function (state) {
      state.localFiles = []
    },
    setLocalFiles: function (state, data) {
      state.localFiles = data
      console.log(`[${(new Date()).toLocaleTimeString()}]: Local files updated.`)
    },
    setCurrentDir: function (state, data) {
      state.currentDir = data
      console.log(`[${(new Date()).toLocaleTimeString()}]: Current directory now is ${state.currentDir}`)
    },
    setConfigDir: function (state, data) {
      state.configDir = data
      console.log(`[${(new Date()).toLocaleTimeString()}]: Config directory now is ${state.currentDir}`)
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
    }
  },
  actions: {
    async releasesInit({commit}) {
      console.log('[INIT] Releases')
      const {data} = await axios.get(`releases.json?`)
      commit('setReleases', data)
    },
    async seasonsInit({state, commit}) {
      console.log('[INIT] Seasons')
      const {data} = await axios.get(`seasons.json?year=${state.year}&season=${state.season}`)

      commit('setSeasons', data)
    },
    async newsInit({commit}) {
      console.log('[INIT] News')
      const {data} = await axios.get('news.json')

      commit('setNews', data)
    },
    async localInit({state, commit}) {
      console.log('[INIT] Local Files')

      const {data} = await axios.get(`local.json?dir=${state.currentDir}`)

      commit('setLocalFiles', data)
    },
    async refreshReleases({commit}) {
      console.log(`[${(new Date()).toLocaleTimeString()}]: Refreshing Releases...`)

      commit('emptyReleases')

      const {data} = await axios.get(`releases.json?`)

      commit('setReleases', data)
    },
    async refreshSeasons({state, commit}) {
      console.log(`[${(new Date()).toLocaleTimeString()}]: Refreshing Seasons...`)

      commit('emptySeasons')

      const year = state.year
      const season = state.season
      const {data} = await axios.get(`seasons.json?year=${year}&season=${season}`)
      commit('setSeasons', data)

      console.log('Seasons refreshed.')
    },
    async refreshNews({commit}) {
      console.log(`[${(new Date()).toLocaleTimeString()}]: Refreshing News...`)

      commit('emptyNews')

      const {data} = await axios.get('news.json')

      commit('setNews', data)
    },
    async refreshLocal({commit, state}) {
      console.log(`[${(new Date()).toLocaleTimeString()}]: Refreshing Local files...`)

      const {data} = await axios.get(`local.json?dir=${state.currentDir}`)

      commit('setLocalFiles', data)
    },
    async changePath({commit, dispatch}) {
      remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirPath) => {
        if (dirPath !== undefined)
        {
          commit('emptyLocals')
          commit('setCurrentDir', dirPath[0])
          dispatch('refreshLocal')
        }
      })
    },
    async changePathWithConfig({commit, dispatch}) {
      remote.dialog.showOpenDialog({properties: ['openDirectory']}, (dirPath) => {
        if (dirPath !== undefined)
        {
          commit('emptyLocals')
          commit('setCurrentDir', dirPath[0])
          commit('setConfigDir', dirPath[0])
          dispatch('refreshLocal')
        }
      })
    },
    async openNewsLink({state}, link) {
      console.log('[News] Opening a link')

      if ( (state.config.inside === 'true' ) === false)
        await axios.get(`openThis?type=link&link=${link}`)
      else
      {
        let win = new remote.BrowserWindow({
          parent: remote.getCurrentWindow(),
          x: 50,
          y: 50,
          minimizable: false,
          maximizable: false,
          resizable: false
        })

        win.loadURL(link)
      }
    },
    async download({state, commit}) {
      const name = state.downloaderForm.name.replace(' ', '_')
      const fromEp = state.downloaderForm.fromEp !== ''
          ? state.downloaderForm.fromEp
          : 0
      const untilEp = state.downloaderForm.untilEp !== ''
          ? state.downloaderForm.untilEp
          : 20000
      const quality = state.downloaderForm.quality

      const magnets = state.config.magnets

      console.log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

      const {data, status} = await axios.get(`download?name=${name}&fromEp=${fromEp}&untilEp=${untilEp}&quality=${quality}&magnets=${magnets}`)

      status === 404
          ? console.log('Oops. It looks like something went wrong. Please check your internet connection and retry.')
          : console.log('Request fulfilled!')

      state.downloaderForm.loading = false

      let magnetLinks = []

      data.links.forEach((link) => {
        magnets === true
            ? magnetLinks.push(link)
            : window.open(link)
      })

      if (magnets === true)
      {
        console.log('User says he prefers having magnets hashes.')
        commit('setDownloaderModal', {
          show: true,
          title: `${name.replace('_', ' ')}\t ${fromEp} - ${untilEp}`,
          text: magnetLinks
        })
      }
      else
      {
        console.log('Opening torrents directly on preferred torrent client.')
      }
    },
    async saveConfig({state}, data) {
      const toSave = JSON.stringify({
        config: data
      })

      writeFileSync(configPath, toSave)
      console.log(`[${(new Date()).toLocaleTimeString()}]: New config saved!`)

      console.log(state.config)
    }
  }
})

store.dispatch('releasesInit').catch(err => {})
store.dispatch('seasonsInit').catch(err => {})
store.dispatch('newsInit').catch(err => {})
store.dispatch('localInit').catch(err => {})

export default store