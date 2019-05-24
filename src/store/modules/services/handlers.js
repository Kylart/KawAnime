import { log } from '@/store/utils'

export const watchLists = {
  success (commit, { service, list }) {
    commit('setList', { service, list })
    log(`Retrieved user list for ${service}.`)
  },
  error (commit, { service, msg }) {
    log('Could not retrieve user list:', msg)
    commit('setError', { service, msg })
  }
}

export const has = {
  success ({ state, commit, dispatch }, { service, data }) {
    console.log('service has', service, data)
    data.forEach((elem) => {
      commit('setValue', { service, ...elem })
    })
    commit('hasUser', service)

    if (!state[service].list) dispatch('getList', { service })
  }
}
