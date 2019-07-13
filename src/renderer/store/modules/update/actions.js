import { ipcRenderer } from '@/store/utils'
import { eventsList } from 'vendor'
import * as handlers from './handlers'

export default {
  init ({ dispatch }) {
    dispatch('setEvents')
  },
  updateApp () {
    ipcRenderer.send(eventsList.update.install.main)
  },

  setEvents ({ commit }) {
    ipcRenderer.on(eventsList.update.available.success, () => {
      handlers.available.success(commit)
    })

    ipcRenderer.on(eventsList.update.installable.success, () => {
      handlers.installable.success(commit)
    })

    ipcRenderer.on(eventsList.update.progress.success, (e, data) => {
      handlers.progress.success(data)
    })
  }
}
