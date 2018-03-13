export default {
  play (state, data) {
    state.player = data
  },
  close (state) {
    state.player.show = false
  }
}
