export default {
  set (state, data) {
    state.files = data
  },
  setDir (state, data) {
    state.dir = data
  },
  addInfo (state, { key, data }) {
    state.info[key] = data
  },
  setInside (state, bool) {
    state.inside = bool
  },
  setRecursiveSearch (state, bool) {
    state.recursiveSearch = bool
  }
}
