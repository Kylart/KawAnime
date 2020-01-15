export default {
  setPlayer (state, data) {
    for (const property of Object.keys(data)) {
      state.player[property] = data[property]
    }
  },
  setNeighbours (state, data) {
    state.player.neighbours = data
  },
  close (state) {
    state.player.show = false
  },
  setEps (state, val) {
    state.page.eps = val
  },
  setControl (state, { name, value }) {
    if (!state.player.controls.hasOwnProperty(name)) throw new Error('[Video Player] Invalid control property mutation')

    state.player.controls[name] = value
  }
}
