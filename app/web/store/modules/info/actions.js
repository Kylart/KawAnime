import { axios, log } from 'store/utils'

export default {
  async get ({ commit, state }, nameOrUrl) {
    const isUrl = /https?:\/\//.test(nameOrUrl)

    const params = {
      [isUrl ? 'url' : 'term']: nameOrUrl
    }

    const { data, status } = await axios.get('getInfoFromMal', { params })

    if (status !== 200) {
      log('error', 'An error occurred while search for', nameOrUrl)
    }

    commit('add', {
      key: nameOrUrl,
      value: data
    })
  }
}
