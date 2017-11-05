import {log} from '../../utils.js'

export default {
  setWatchLists (state, data) {
    state.watchLists = data
    log('MyAnimeList > Watch lists loaded.')
  },
  showForm (state, bool) {
    state.form = bool
  }
}
