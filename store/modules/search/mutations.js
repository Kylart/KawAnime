export default {
  showInfo (state, bool) {
    state.info.show = bool
  },
  setInfoError (state, data) {
    state.info.error = data
  },
  setInfo (state, data) {
    state.info.info = data
  },
  setInfoLoading (state, bool) {
    state.info.loading = bool
  },
  setInfoTerm (state, data) {
    state.info.term = data
  },
  show (state, bool) {
    state.search = bool
  }
}
