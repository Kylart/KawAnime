import { log } from '@/store/utils'

export const get = {
  success (commit, data) {
    log('Loaded history.')
    commit('set', data)
  },
  error (msg) {
    log('An error occurred while gathering the history.')
  }
}

export const append = {
  success (dispatch) {
    log('Successfully appended to history.')
    dispatch('get')
  },
  error (msg) {
    log('An error occurred while appending to history.', msg)
  }
}

export const remove = {
  success (dispatch) {
    log('Successfully updated local information.')
    dispatch('get')
  },
  error (msg) {
    log('Could not remove entry from history.', msg)
  }
}
