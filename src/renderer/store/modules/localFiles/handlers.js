import { log, isRoot } from '@/store/utils'

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
  success ({ rootState, commit, dispatch }, data) {
    const { isUpdate, title, info } = data

    log(`Successfully ${isUpdate ? 'updated' : 'saved'} local information for ${title}.`)

    // We update the store data too.
    if (isUpdate && Object.prototype.hasOwnProperty.call(rootState.info.info.local, title)) {
      commit('info/set', {
        isLocal: true,
        name: title,
        info
      }, isRoot)
    } else if (!isUpdate) {
      dispatch('update')
    }
  },
  error (msg) {
    log('An error occurred while updating locals informaton.', msg)
  }
}
