import { axios, log } from 'store/utils'

export default {
  async init ({ dispatch }) {
    setInterval(() => {
      dispatch('getData')
    }, 500)
  },
  async getData ({ commit }) {
    try {
      const { data: { client, torrents }, status } = await axios.get('torrent/info')

      if (status === 200) {
        commit('set', torrents)
        commit('setClient', client)
      }
    } catch (e) { void e }
  },
  async add ({ rootState }, { torrent, path }) {
    try {
      await axios.post('torrent/add', {
        magnet: torrent,
        path: path || rootState.config.config.torrentClient.defaultPath
      })
    } catch (e) {
      log('An error occurred while adding a torrent:', e.message)
    }
  }
}
