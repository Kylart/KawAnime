/**
 * Created by Kylart on 26/07/2017.
 */

import moment from 'moment'
import {log} from './utils'

export default {
  setEnv (state, data) {
    state.platform = data.platform
    state.NODE_ENV = data.NODE_ENV
  },
  setConnected (state, bool) {
    state.isConnected = bool
  },
  setUpdateStatus (state) {
    state.isUpdateAvailable = true
  },
  init (state, data) {
    const config = data

    state.releaseFansub = config.fansub
    state.releaseQuality = config.quality
    state.downloaderForm.quality = config.quality
    state.currentDir = config.localPath

    state.releaseParams.fansub = config.fansub
    state.releaseParams.quality = config.quality

    state.config.config = config
  },
  toggleDrawer (state) {
    state.drawer = !state.drawer
  },
  setReleaseParams (state, data) {
    state.releaseParams = data
  },
  setInfoSnackbar (state, data) {
    state.infoSnackbar.text = data
    state.infoSnackbar.show = true
  },
  emptyReleases (state) {
    state.releases = []
  },
  setReleases (state, data) {
    state.releases = data
    state.releasesUpdateTime = moment()

    log(`Releases updated.`)
  },
  emptyLocals (state) {
    state.localFiles = []
  },
  setLocalFiles (state, data) {
    state.localFiles = data
    log(`Local files updated.`)
  },
  setCurrentDir (state, data) {
    state.currentDir = data
    log(`Current directory now is ${state.currentDir}.`)
  },
  setResettingLocal (state) {
    state.resettingLocal = !state.resettingLocal
  },
  setRefreshingLocal (state) {
    state.refreshingLocal = !state.refreshingLocal
  },
  updateLocalFiles (state, data) {
    if (data.type === 'delete') {
      const index = state.localFiles.findIndex((file) => file.path === data.path)

      state.localFiles.splice(index, 1)
    }
  },
  setDownloaderValues (state, data) {
    state.downloaderForm = data
  },
  setQuality (state, quality) {
    state.downloaderForm.quality = quality
  },
  setDownloaderModal (state, data) {
    state.downloaderModal = data
  },
  showDownloaderModal (state, value) {
    state.downloaderModal.show = value
  },
  setHistory (state, data) {
    state.history = data
    log(`History updated.`)
  },
  setHistoryModal (state, data) {
    state.historyModal = data
  },
  setInfoModal (state, data) {
    state.infoModal = data
  },
  setInfoModalInfo (state, data) {
    state.info = data
  },
  setAddToChoice (state, data) {
    state.addToChoice = data
  },
  showInfo (state, bool) {
    state.info.show = bool
  },
  setInfoError (state, data) {
    state.info.error = data
  },
  setInfo (state, data) {
    state.info.info = data
  },
  setInfoLoading (state, bool) {
    state.info.loading = bool
  },
  setInfoTerm (state, data) {
    state.info.term = data
  }
}
