import {log, moment} from 'store/utils.js'

export default {
  set (state, obj) {
    const {old, data} = obj

    if (!old) {
      state.updateTime = moment()
      state.notLoaded = false

      state.releases = data

      log(`Releases updated.`)
    } else {
      state.notLoaded = true

      state.releases = old

      log('Releases were not updated and put back to a back up.')
    }
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
