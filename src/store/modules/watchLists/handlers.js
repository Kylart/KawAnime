import { log } from '@/store/utils'

export const get = {
  success (commit, data) {
    log('Loaded watch lists')
    commit('set', JSON.parse(data))
  },
  error (msg) {
    log('An error occurred while retrieving the watch lists.', msg)
  }
}

export const update = {
  success () {
    log('Successfully updated local information.')
  },
  error (msg) {
    log(`An error occurred while updating the watch lists.`, msg)
  }
}
