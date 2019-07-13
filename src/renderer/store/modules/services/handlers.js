import { log, isRoot } from '@/store/utils'

export const watchLists = {
  get: {
    success (commit, { service, list }) {
      commit('setLoading', { service, value: false })
      commit('setList', { service, list })
      log(`Retrieved user list for ${service}.`)
    },
    error (commit, { service, msg }) {
      commit('setLoading', { service, value: false })
      commit('setError', { service, msg })
      log('Could not retrieve user list:', msg)
    }
  },
  update: {
    success ({ dispatch, commit }, { service, list }) {
      dispatch('getList', { service })
      commit('setInfoSnackbar', 'Update successful!', isRoot)
    },
    error (commit, { service, msg }) {
      log('Could not update list:', msg)
      commit('setInfoSnackbar', 'Sorry, update failed!', isRoot)
    }
  }
}

export const has = {
  success ({ state, commit, dispatch }, { service, data }) {
    data.forEach((elem) => {
      commit('setValue', { service, ...elem })
    })
    commit('hasUser', service)

    if (!state[service].list) dispatch('getList', { service })
  }
}
