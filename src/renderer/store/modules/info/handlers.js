import { log } from '@/store/utils'

export const episodes = {
  success (commit, data) {
    commit('addEps', data)
  },
  error ({ name, msg }) {
    log('An error occurred while searching episodes for', name, msg)
  }
}
