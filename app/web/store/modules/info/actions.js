import { axios, log } from 'store/utils'

export default {
  async saveLocalInfo ({ state, commit }, data) {
    try {
      const { isUpdate, title, info } = data

      await axios.post('local/save', data)

      // We update the store data too.
      const key = `local/${title}`

      if (isUpdate && state.info.hasOwnProperty(key)) {
        commit('set', {
          key,
          value: info
        })
      }
    } catch (e) {
      log('An error occurred while saving / updating local informaton.', e)
    }
  },
  async get ({ commit, state, dispatch }, name) {
    let url = null

    if (typeof name === 'object') {
      url = name.url
      name = name.name
    }

    const params = {
      [url ? 'url' : 'term']: url || name
    }

    const { data, status } = await axios.get('getInfoFromMal', { params })

    if (status !== 200) {
      log('An error occurred while searching for', name)
      return
    }

    commit('set', {
      key: name,
      value: data
    })
  },
  async getEps ({ commit }, { name, id }) {
    const searchName = name.replace('local/', '')

    try {
      const { data, status } = await axios.get('searchEpsOnMal', {
        params: { name: searchName, id }
      })

      if (status === 204) {
        log('An error occurred while searching episodes for', searchName)
        return
      }

      commit('addEps', { name, data })
    } catch (e) {
      log('error', 'Server error:', e)
    }
  },
  async getEpsLinks ({ rootState, commit }, { name, config }) {
    const searchName = name.replace('local/', '')

    try {
      const { data, status } = await axios.post('download', { name: searchName, ...config })

      if (status === 204) {
        log('An error occurred while getting ep links for', searchName)
        return
      }

      commit('addEpsLinks', { name, data })
    } catch (e) {
      log('error', 'Server error:', e)
    }
  }
}
