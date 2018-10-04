import { _ } from 'store/utils.js'

export default {
  setWatchLists (state, data) {
    state.watchLists = data
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
    state.watchLists = _.remove(state.watchLists, (o) => o.id !== id)
  },
  setTagsFilter (state, tags) {
    state.tagsFilter = tags
  },
  setCustomTags (state) {
    const result = []
    const entryWithTags = state.watchLists.filter((entry) => entry.tags !== '')
    const tagsArray = entryWithTags.map((entry) => entry.tags.split(', '))

    _.each(tagsArray, (tags) => {
      _.each(tags, (tag) => result.push(tag))
    })

    state.customTags = result
  }
}
