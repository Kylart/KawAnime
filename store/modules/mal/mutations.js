import {_, log} from '../../utils.js'

export default {
  setWatchLists (state, data) {
    state.watchLists = data
    log('MyAnimeList > Watch lists loaded.')
  },
  showForm (state, bool) {
    state.form = bool
  },
  setEntry (state, itemOrID) {
    const id = itemOrID.id || itemOrID
    // Need to find the right entry in the lists if it's in there
    state.entry = _.find(state.watchLists, (o) => o.id === id) || itemOrID
  },
  isAdding (state, bool) {
    state.isAdding = bool
  },
  isLoading (state, bool) {
    state.isLoading = bool
  },
  removeFromLists (state, id) {
    state.watchLists = _.remove(state.watchLists, (o) => o.anime_id !== id)
  }
}
