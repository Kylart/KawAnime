import {log} from '../../utils'

export default {
  setDir (state, data) {
    state.config.localPath = data
    log(`Config directory now is ${data}.`)
  },
  set (state, data) {
    state.config = data
    log('Current config: ', state.config)
  }
}
