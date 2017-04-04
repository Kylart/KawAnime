import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    releases: [],
    seasons: [],
    seasonsStats: {},
    year: 2017,
    season: 'spring'
  },
  mutations: {
    setSeasons: function (state, data) {
      state.seasons = data.info
      state.seasonsStats = data.stats
      console.log('Seasons set.')
    },
    emptySeasons: function (state) {
      state.seasons = []
    },
    setReleases: function (state, data) {
      state.releases = data
      console.log(`[${(new Date()).toLocaleTimeString()}]: Releases updated.`)
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
    }
  }
})

store.dispatch('releasesInit')
store.dispatch('seasonsInit')

export default store