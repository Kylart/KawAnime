import {log} from '../../utils'

export default {
  empty (state) {
    state.data = []
  },
  set (state, data) {
    state.data = data
    log(`News updated.`)
  }
}
