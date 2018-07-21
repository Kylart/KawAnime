import {axios} from 'store/utils'

export default {
  async fromUrl ({commit, state}, item) {
    const url = item.url || item.link
    const name = item.name || item.title

    if (name === state.info.term) {
      commit('showInfo', true)
    } else {
      commit('setInfoTerm', name)
      commit('setInfoLoading', true)
      commit('showInfo', true)
      const {data, status} = await axios.get(`getInfoFromMal`, {
        params: {url}
      })

      commit('setInfoLoading', false)

      status === 200
        ? commit('setInfo', data)
        : commit('setInfoError', `An error occurred while retrieving information of ${name}..`)
    }
  },
  // Temporary work-around while waiting for malScraper 2.0
  async fromName ({commit, state}, name) {
    if (name === state.info.term) {
      commit('showInfo', true)
    } else {
      commit('setInfoTerm', name)
      commit('setInfoLoading', true)
      commit('showInfo', true)
      const {data, status} = await axios.get(`getInfoFromMal`, {
        params: {term: name}
      })

      commit('setInfoLoading', false)

      status === 200
        ? commit('setInfo', data)
        : commit('setInfoError', `An error occurred while retrieving information of ${name}..`)
    }
  }
}
