import {moment} from 'store/utils.js'

export default {
  set (state, data) {
    state.releases = data
    state.updateTime = moment()
  },
  setParams (state, data) {
    state.params = data
  },
  empty (state) {
    state.releases = []
  },
  setQuality (state, data) {
    state.params.quality = data
  },
  setFansub (state, data) {
    state.params.fansub = data
  },
  setChoice (state, data) {
    state.params.choice = data
  }
}
