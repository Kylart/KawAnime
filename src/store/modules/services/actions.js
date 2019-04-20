import { ipcRenderer } from '@/store/utils'
import { eventsList } from '@/vendor'

export default {
  set ({ commit }, info) {
    ipcRenderer.send(eventsList.vault.update.main, info)
  }
}
