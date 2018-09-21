import {moment} from 'store/utils.js'

export default {
  set (state, data) {
    state.releases = data
    state.updateTime = moment()
  },
  setCurrent (state, name) {
    state.current = name
  },
  setParams (state, data) {
    state.params = data
  },
  refreshing (state, bool) {
    state.isRefreshing = bool
  }
}
