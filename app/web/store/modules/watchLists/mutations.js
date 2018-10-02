export default {
  set (state, data) {
    state.lists = data
  },
  addTo (state, data) {
    const { listName, entry } = data
    state.lists[listName].push(entry)
    state.lists[listName].sort()
  },
  removeFrom (state, data) {
    const { listName, entry } = data
    const index = state.lists[listName].indexOf(entry)
    state.lists[listName].splice(index, 1)
  }
}
