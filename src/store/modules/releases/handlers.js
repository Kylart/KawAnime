import { log } from '@/store/utils'

export const get = {
  success (commit, data) {
    commit('set', data)
    commit('refreshing', false)
  },
  error (commit, msg) {
    log('Error while refreshing the releases.', msg)
    commit('refreshing', false)
  }
}
