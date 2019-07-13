import { log } from '@/store/utils'

export default {
  set (state, data) {
    state.config = data
  },
  setDir (state, data) {
    state.config.localPath = data
    log(`Config directory now is ${data}.`)
  }
}
