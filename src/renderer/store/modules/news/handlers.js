import { log } from '@/store/utils'

export function success (commit, data) {
  commit('set', data)
  commit('setRefreshing', false)
}

export function error (commit, msg) {
  log('Error while updating anime news.', msg)
  commit('setRefreshing', false)
}
