import { axios, log } from 'store/utils'

export default {
  async get ({ commit, state, dispatch }, nameOrUrl) {
    const isUrl = /https?:\/\//.test(nameOrUrl)

    const params = {
      [isUrl ? 'url' : 'term']: nameOrUrl
    }

    const { data, status } = await axios.get('getInfoFromMal', { params })

    if (status !== 200) {
      log('error', 'An error occurred while search for', nameOrUrl)

      setTimeout(() => {
        dispatch('get', nameOrUrl)
      }, 30 * 1000)
    }

    commit('add', {
      key: nameOrUrl,
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

      console.log(data)

      commit('addEpsLinks', { name, data })
    } catch (e) {
      log('error', 'Server error:', e)
    }
  }
}
