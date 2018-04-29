import {log} from 'store/utils'

export default {
  setCurrentSeason (state, data) {
    state.year = data.year
    state.season = data.season
  },
  setSeasons (state, data) {
    state.seasons = data
    log(`Seasons set.`)
  },
  emptySeasons (state) {
    state.seasons = []
  }
}
