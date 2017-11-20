import {axios, log, isRoot} from '../../utils'

export default {
  async init ({commit, dispatch}) {
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
      commit('setInfoSnackbar', msg, isRoot)

      setTimeout(() => dispatch('init'), 10 * 1000)
    }
  },
  async refresh ({state, commit, dispatch}) {
    log(`Refreshing Seasons...`)

    const year = state.year
    const season = state.season.value || state.season

    if (year >= 1917 && (year <= (new Date()).getYear() + 1901)) {
      commit('emptySeasons')

      const {data, status} = await axios.get(`seasons.json?year=${year}&season=${season}`)

      status === 200
        ? commit('setSeasons', data)
        : dispatch('refreshSeasons')

      log('Seasons refreshed.')
    } else {
      commit('setInfoSnackbar', `Year must be between 1917 and ${(new Date()).getYear() + 1901}`, isRoot)
    }
  }
}
