export default {
  play (state, data) {
    state.player = data
  },
  setNeighbours (state, data) {
    state.player.neighbours = data
  },
  close (state) {
    state.player.show = false
  },
  setTerm (state, val) {
    state.page.term = val
  },
  setTorrents (state, torrents) {
    state.page.torrents = torrents
  },
  setInfos (state, data) {
    state.page.infos = data
  },
  setCurrent (state, val) {
    state.page.current = val
  },
  setEps (state, val) {
    state.page.eps = val
  }
}
