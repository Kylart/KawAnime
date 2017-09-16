import {log} from '../../utils'

export default {
  setCurrentSeason (state, data) {
    state.year = data.year
    state.season = data.season
  },
  setSeasons (state, data) {
    state.seasons = data.info
    state.seasonsStats = data.stats
    log(`Seasons set.`)
  },
  emptySeasons (state) {
    state.seasons = []
  }
}
