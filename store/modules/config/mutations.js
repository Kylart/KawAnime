import {log} from '../../utils'

export default {
  set (state, data) {
    state.config = data
    log('Current config: ', state.config)
  },
  setDir (state, data) {
    state.config.localPath = data
    log(`Config directory now is ${data}.`)
  }
}
