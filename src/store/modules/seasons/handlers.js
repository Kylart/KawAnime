import { log } from '@/store/utils'

export function success (commit, data) {
  commit('set', data)
  commit('refreshing', false)
  log('Seasons refreshed.')
}

export function error ({ commit, dispatch }, msg) {
  log('Could not refresh seasonal information.', msg)
  commit('refreshing', false)
  setTimeout(() => { dispatch('refresh') }, 60 * 1000)
}
