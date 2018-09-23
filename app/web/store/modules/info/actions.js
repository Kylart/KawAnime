import { axios, log } from 'store/utils'

export default {
  async get ({ commit, state, dispatch }, name) {
    let url = null
    const backUp = name

    if (typeof name === 'object') {
      url = name.url
      name = name.name
    }

    const params = {
      [url ? 'url' : 'term']: url || name
    }

    const { data, status } = await axios.get('getInfoFromMal', { params })

    if (status !== 200) {
      log('error', 'An error occurred while search for', name)

      setTimeout(() => {
        dispatch('get', backUp)
      }, 30 * 1000)
    }

    commit('add', {
      key: name,
      value: data
    })
  },
  async getEps ({ commit }, { name, id }) {
    try {
      const { data, status } = await axios.get('searchEpsOnMal', {
        params: { name, id }
      })

      if (status === 204) {
        log('error', 'An error occurred while searching for', name)
        return
      }

      commit('addEps', { name, data })
    } catch (e) {
      log('error', 'Server error:', e)
    }
  },
  async getEpsLinks ({ rootState, commit }, { name, config }) {
    try {
      const { data, status } = await axios.post('download', { name, ...config })

      if (status === 204) {
        log('error', 'An error occurred while getting ep links for' + name)
        return
      }

      commit('addEpsLinks', { name, data })
    } catch (e) {
      log('error', 'Server error:', e)
    }
  }
}
