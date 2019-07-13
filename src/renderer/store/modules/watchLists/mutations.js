export default {
  set (state, data) {
    state.lists = data
  },
  toggleForm (state, bool) {
    state.form.show = bool
  },
  setEntry (state, entry) {
    state.form.entry = entry
  },
  resetEntry (state) {
    state.form.entry = null
  },
  setLastUpdate (state, value) {
    state.lastUpdate = value
  }
}
