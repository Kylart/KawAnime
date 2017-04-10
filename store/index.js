//noinspection NpmUsedModulesInstalled
import Vue from 'vue'
//noinspection NpmUsedModulesInstalled
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    releases: [],
    prefMagnets: false,
    downloaderForm: {
      name: '',
      fromEp: '',
      untilEp: '',
      quality: '720p',
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
    season: 'spring'
  },
  mutations: {
    setSeasons: function (state, data) {
      state.seasons = data.info
      state.seasonsStats = data.stats
      console.log(`[${(new Date()).toLocaleTimeString()}]: Seasons set.`)
    },
    emptySeasons: function (state) {
      state.seasons = []
    },
    setReleases: function (state, data) {
      state.releases = data
      console.log(`[${(new Date()).toLocaleTimeString()}]: Releases updated.`)
    },
    setDownloaderValues: function (state, data) {
      state.downloaderForm = data
    },
    setDownloaderModal: function (state, data) {
      state.downloaderModal = data
    },
    showDownloaderModal: function (state, value) {
      state.downloaderModal.show = value
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
    async refreshSeasons({state, commit}) {
      console.log('Refreshing Seasons...')

      commit('emptySeasons')

      const year = state.year
      const season = state.season
      const {data} = await axios.get(`seasons.json?year=${year}&season=${season}`)
      commit('setSeasons', data)

      console.log('Seasons refreshed.')
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

      const magnets = state.prefMagnets

      console.log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

      const {data, status} = await axios.get(`download?name=${name}&fromEp=${fromEp}&untilEp=${untilEp}&quality=${quality}&magnets=${magnets}`)

      status === 404
          ? console.log('Oops. It looks like something went wrong. Please check your internet connection and retry.')
          : console.log('Request fulfilled!')

      state.downloaderForm.loading = false

      let magnetLinks = []

      data.links.forEach((link) => {
        magnets
            ? magnetLinks.push(link)
            : window.open(link)
      })

      if (magnets)
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
    }
  }
})

store.dispatch('releasesInit').catch(err => {})
store.dispatch('seasonsInit').catch(err => {})

export default store