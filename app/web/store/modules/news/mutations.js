export default {
  set (state, data) {
    state.data = data
  },
  setRefreshing (state, bool) {
    state.refreshing = bool
  },
  setFeed (state, feed) {
    state.feed = feed
  }
}
