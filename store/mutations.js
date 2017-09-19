/**
 * Created by Kylart on 26/07/2017.
 */

export default {
  setEnv (state, data) {
    state.platform = data.platform
    state.NODE_ENV = data.NODE_ENV
  },
  setConnected (state, bool) {
    state.isConnected = bool
  },
  setUpdateStatus (state) {
    state.isUpdateAvailable = true
  },
  toggleDrawer (state) {
    state.drawer = !state.drawer
  },
  setInfoSnackbar (state, data) {
    state.infoSnackbar.text = data
    state.infoSnackbar.show = true
  },
  setInfoModal (state, data) {
    state.infoModal = data
  },
  setInfoModalInfo (state, data) {
    state.info = data
  },
  setAddToChoice (state, data) {
    state.addToChoice = data
  },
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
  }
}
