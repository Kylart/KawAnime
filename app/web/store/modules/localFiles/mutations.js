import {log} from 'store/utils'

export default {
  set (state, data) {
    state.files = data
    log(`Local files updated.`)
  },
  empty (state) {
    state.files = []
  },
  setDir (state, data) {
    state.dir = data
    log(`Current directory is set to ${state.dir}.`)
  },
  toggleResetting (state) {
    state.resetting = !state.resetting
  },
  toggleRefreshing (state) {
    state.refreshing = !state.refreshing
  },
  updateFiles (state, data) {
    if (data.type === 'delete') {
      const index = state.files.findIndex((file) => file.path === data.path)

      state.files.splice(index, 1)
    }
  }
}
