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
  toggleDrawer (state) {
    state.drawer = !state.drawer
  },
  setInfoSnackbar (state, data) {
    state.infoSnackbar.text = data
    state.infoSnackbar.show = true
  },
  setAddToChoice (state, data) {
    state.addToChoice.show = data
  },
  setAddToChoiceTitle (state, data) {
    state.addToChoice.title = data
  }
}
