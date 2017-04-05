import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    releases: [],
    prefMagnets: true,
    downloaderForm: {
      name: '',
      fromEp: '',
      untilEp: '',
      quality: '720p',
      loading: false
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

      const year = state.year
      const season = state.season
      const {data} = await axios.get(`seasons.json?year=${year}&season=${season}`)
      commit('emptySeasons')
      commit('setSeasons', data)

      console.log('Seasons refreshed.')
    },
    async download({state}) {
      const name = state.downloaderForm.name
      const fromEp = state.downloaderForm.fromEp !== ''
          ? state.downloaderForm.fromEp
          : 0
      const untilEp = state.downloaderForm.untilEp !== ''
          ? state.downloaderForm.untilEp
          : 20000

      console.log(`Received a request to download ${name} from ep ${fromEp} to ep ${untilEp}. Transmitting...`)

    }
  }
})

store.dispatch('releasesInit')
store.dispatch('seasonsInit')

export default store