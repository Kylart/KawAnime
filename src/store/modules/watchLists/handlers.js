import { log } from '@/store/utils'

export const get = {
  success (commit, data) {
    log('Loaded watch lists')
    commit('set', data)
  },
  error (msg) {
    log('An error occurred while retrieving the watch lists.', msg)
  }
}

export const update = {
  success (commit, data) {
    log('Successfully updated local information.')
    commit('set', data)
  },
  error (msg) {
    log(`An error occurred while updating the watch lists.`, msg)
  }
}
