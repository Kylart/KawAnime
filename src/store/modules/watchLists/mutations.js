export default {
  set (state, data) {
    state.lists = data
  },
  toggleForm (state, bool) {
    state.form.show = bool
  },
  setFormEntry (state, value) {
    state.form.entry = value
  }
}
