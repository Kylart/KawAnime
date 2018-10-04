import { axios } from 'store/utils'

export default {
  async getData ({ commit }) {
    try {
      const { data: { client, torrents }, status } = await axios.get('torrent/info')

      if (status === 200) {
        commit('set', torrents)
        commit('setClient', client)
      }
    } catch (e) { void e }
  }
}
