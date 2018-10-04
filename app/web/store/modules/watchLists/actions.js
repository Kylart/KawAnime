import { axios } from 'store/utils'

export default {
  async init ({ dispatch }) {
    console.log('[INIT] Watch List')

    dispatch('get')
  },
  async save ({ state }) {
    await axios.post('saveWatchList', JSON.stringify(state.lists))
  },
  async get ({ commit }) {
    const { data } = await axios.get('watchLists')

    commit('set', data)
  }
}
