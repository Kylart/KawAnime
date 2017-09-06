/**
 * Created by Kylart on 26/07/2017.
 */

import moment from 'moment'

export default {
  NODE_ENV: '',
  platform: '',
  isUpdateAvailable: false,
  isConnected: false,
  drawer: false,
  autoRefreshReleases: true,
  fansubList: [
    'HorribleSubs',
    'Erai-raws',
    'PuyaSubs!',
    'Fuyu',
    'DurandalSubs',
    'DefinitelyNotMe'
  ],
  soundList: [
    'Nyanpasu',
    'Nico Nico Nii',
    'None'
  ],
  releaseFansub: '',
  releaseQuality: '',
  releases: [],
  releasesUpdateTime: moment(),
  releaseParams: {
    fansub: '',
    quality: '',
    choice: 'si'
  },
  infoSnackbar: {
    show: false,
    text: ''
  },
  downloaderForm: {
    name: '',
    fromEp: '',
    untilEp: '',
    quality: '',
    loading: false
  },
  downloaderModal: {
    show: false,
    title: '',
    text: ''
  },
  seasons: [],
  seasonsStats: {},
  year: 0,
  season: '',
  news: [],
  localFiles: [],
  resettingLocal: false,
  refreshingLocal: false,
  watchLists: {
    watchList: [],
    watching: [],
    seen: [],
    onHold: [],
    dropped: []
  },
  config: {
    fansub: 'HorribleSubs',
    quality: '720p',
    localPath: '',
    sound: 'Nyanpasu',
    inside: true,
    magnets: false,
    system: {
      autoStart: false,
      toTray: false
    }
  },
  history: {},
  historyModal: false,
  infoModal: false,
  info: {
    info: {},
    error: '',
    loading: true,
    show: false,
    term: ''
  },
  addToChoice: false
}
