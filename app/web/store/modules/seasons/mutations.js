export default {
  set (state, data) {
    state.seasons = data
  },
  setSeason (state, value) {
    state.season = value
  },
  setYear (state, value) {
    state.year = value
  },
  refreshing (state, bool) {
    state.isRefreshing = bool
  }
}
