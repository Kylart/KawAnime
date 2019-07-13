import { eventsList } from '../../vendor'
import { ipcRenderer } from './utils'

export default {
  async init ({ dispatch }) {
    // Offline
    dispatch('config/init')
    dispatch('update/init')
    dispatch('localFiles/init')
    dispatch('history/init')
    dispatch('watchLists/init')
    dispatch('torrents/init')
    dispatch('info/init')
    dispatch('downloader/init')
    dispatch('torrents/init')

    dispatch('setEvents')

    // Online
    dispatch('checkOnlineStatus')
  },
  online ({ dispatch }) {
    dispatch('releases/init')
    dispatch('news/init')
    dispatch('seasons/init')
    dispatch('services/init')

    setInterval(() => {
      dispatch('checkOnlineStatus')
    }, 60 * 1000)
  },
  checkOnlineStatus () {
    ipcRenderer.send(eventsList.isOnline.main)
  },
  analytics ({ state }, args) {
    const { config: { system: { analytics } } } = state.config

    if (analytics) {
      ipcRenderer.send(eventsList.analytics.main, args)
    }
  },

  setEvents ({ state, commit, dispatch }) {
    ipcRenderer.on(eventsList.isOnline.success, (e) => {
      const isConnected = state.isConnected

      // Start retrieving data every time we get online
      if (!isConnected) {
        commit('setConnected', true)

        dispatch('online')

        dispatch('releases/refresh')
        dispatch('news/refresh')
        dispatch('seasons/refresh')
      }
    })

    ipcRenderer.on(eventsList.isOnline.error, () => {
      commit('setConnected', false)
    })
  }
}
