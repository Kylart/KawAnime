import { log } from '@/store/utils'

export const get = {
  success (commit, { name, dir, result: data }) {
    if (dir) {
      log('Loaded local files.')
      commit('set', data)
    }
  },
  error (msg) {
    log('An error occurred while checking for the files.', msg)
  }
}

export const update = {
  success ({ state, commit, dispatch }, data) {
    const { isUpdate, title, info } = data

    log(`Successfully ${isUpdate ? 'updated' : 'saved'} local information for ${title}.`)

    // We update the store data too.
    const key = `local/${title}`

    if (isUpdate && state.info.hasOwnProperty(key)) {
      commit('set', {
        key,
        value: info
      })
    } else if (!isUpdate) {
      dispatch('update')
    }
  },
  error (msg) {
    log(`An error occurred while updating locals informaton.`, msg)
  }
}
