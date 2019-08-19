/**
 * Created by Kylart on 26/07/2017.
 */

export default {
  setConnected (state, bool) {
    state.isConnected = bool
  },
  setLeftDrawer (state, bool) {
    state.drawer.left = bool
  },
  setMiniDrawer (state, bool) {
    state.drawer.mini = bool
  },
  setInfoSnackbar (state, data) {
    state.infoSnackbar.text = data
    state.infoSnackbar.show = true
  }
}
