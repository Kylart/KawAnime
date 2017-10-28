import {axios} from '../../utils'

export default {
  async fromUrl ({commit, state}, item) {
    const {name, url} = item

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
  }
}
