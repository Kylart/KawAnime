export default {
  set (state, data) {
    state.torrents = data
  },
  setClient (state, data) {
    state.client = data
  },
  showDialog (state, bool) {
    state.dialog.show = bool
  }
}
