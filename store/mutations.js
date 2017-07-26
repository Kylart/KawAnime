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
  init (state, data) {
    const config = data
    config.inside = config.inside.toString()

    // config file looks like this
    // const config = {
    //   fansub: 'HorribleSubs',
    //   quality: '720p',
    //   localPath: join(userInfo().homedir, 'Downloads'),
    //   inside: true,
    //   magnets: false
    // }

    state.releaseFansub = config.fansub
    state.releaseQuality = config.quality
    state.downloaderForm.quality = config.quality
    state.currentDir = config.localPath

    state.releaseParams.fansub = config.fansub
    state.releaseParams.quality = config.quality

    state.config = config
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
  setCurrentSeason (state, data) {
    state.year = data.year
    state.season = data.season
  },
  setSeasons: function (state, data) {
    state.seasons = data.info
    state.seasonsStats = data.stats
    log(`Seasons set.`)
  },
  emptySeasons: function (state) {
    state.seasons = []
  },
  emptyReleases: function (state) {
    state.releases = []
  },
  setReleases: function (state, data) {
    state.releases = data
    state.releasesUpdateTime = moment()

    log(`Releases updated.`)
  },
  emptyNews: function (state) {
    state.news = []
  },
  setNews: function (state, data) {
    state.news = data
    log(`News updated.`)
  },
  emptyLocals: function (state) {
    state.localFiles = []
  },
  setLocalFiles: function (state, data) {
    state.localFiles = data
    log(`Local files updated.`)
  },
  setCurrentDir: function (state, data) {
    state.currentDir = data
    log(`Current directory now is ${state.currentDir}.`)
  },
  setResettingLocal: function (state) {
    state.resettingLocal = !state.resettingLocal
  },
  setRefreshingLocal: function (state) {
    state.refreshingLocal = !state.refreshingLocal
  },
  updateLocalFiles: function (state, data) {
    if (data.type === 'delete') {
      const index = state.localFiles.findIndex((file) => file.path === data.path)

      state.localFiles.splice(index, 1)
    }
  },
  setWatchLists: function (state, data) {
    state.watchLists = data
    log('Updated watch lists.')
  },
  setDownloaderValues: function (state, data) {
    state.downloaderForm = data
  },
  setQuality: function (state, quality) {
    state.downloaderForm.quality = quality
  },
  setDownloaderModal: function (state, data) {
    state.downloaderModal = data
  },
  showDownloaderModal: function (state, value) {
    state.downloaderModal.show = value
  },
  setConfigDir: function (state, data) {
    state.config.localPath = data
    log(`Config directory now is ${state.currentDir}`)
  },
  setConfig: function (state, data) {
    state.config = data
  },
  setHistory: function (state, data) {
    state.history = data
    log(`History updated.`)
  },
  setHistoryModal: function (state, data) {
    state.historyModal = data
  },
  setInfoModal: function (state, data) {
    state.infoModal = data
  },
  setInfoModalInfo: function (state, data) {
    state.info = data
  },
  updateList (state, data) {
    const lists = {
      watchList: 'Watch list',
      onHold: 'On Hold'
    }

    const listName = data.listName
    const logListName = lists[data.listName] || listName
    const entry = data.entry

    if (!state.watchLists[listName].includes(entry)) {
      state.watchLists[listName].push(entry)
      state.watchLists[listName].sort()

      log(`${listName} list updated.`)
      state.infoSnackbar.text = `${entry} was added to your «${logListName}» list.`
      state.infoSnackbar.show = true
    } else {
      // Displays error message
      state.infoSnackbar.text = `${entry} is already in your «${logListName}» list.`
      state.infoSnackbar.show = true
    }
  },
  removeFromList (state, data) {
    const listName = data.listName
    const index = state.watchLists[listName].indexOf(data.entry)

    state.watchLists[listName].splice(index, 1)
  },
  setAddToChoice (state, data) {
    state.addToChoice = data
  }
}
