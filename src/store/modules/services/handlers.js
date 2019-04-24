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
  success ({ state, commit, dispatch }, { service, username }) {
    username && commit('setUser', { service, username })
    commit('hasUser', service)

    if (!state[service].list) dispatch('getList', { service })
  }
}
