import { axios, log } from 'store/utils'

export default {
  async getData ({ commit }) {
    try {
      const { data: { client, torrents }, status } = await axios.get('torrent/info')

      if (status === 200) {
        commit('set', torrents)
        commit('setClient', client)
      }
    } catch (e) { void e }
  },
  async addTorrent (state, torrent) {
    try {
      const path = '/Users/Kylart/Downloads'
      await axios.post('torrent/add', {
        magnet: torrent,
        path
      })
    } catch (e) {
      log('An error occurred while adding a torrent:', e.message)
    }
  }
}
