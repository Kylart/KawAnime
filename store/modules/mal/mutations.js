import {_, log} from '../../utils.js'

export default {
  setWatchLists (state, data) {
    state.watchLists = data
    log('MyAnimeList > Watch lists loaded.')
  },
  showForm (state, bool) {
    state.form = bool
  },
  setEntry (state, name) {
    if (name) {
      // Need to find the right entry in the lists
      state.entry = _.find(state.watchLists, (o) => o === name) || {}
    }
  }
}
