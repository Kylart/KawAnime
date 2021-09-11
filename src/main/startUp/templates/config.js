import { app } from 'electron'

const downloadPath = app.getPath('downloads')
const tmpPath = app.getPath('temp')

export default {
  filename: 'config.json',
  template: {
    config: {
      fansub: 'SubsPlease',
      quality: '720p',
      feed: 'si',
      autoTracking: {
        local: true,
        mal: true,
        anilist: true,
        kitsu: true
      },
      infoProvider: {
        episodes: 'mal',
        info: 'anilist',
        search: 'kitsu',
        seasons: 'anilist',
        news: 'mal'
      },
      localPath: downloadPath,
      recursiveSearch: false,
      sound: 'Nyanpasu',
      notificationVolume: 0.5,
      inside: true,
      system: {
        darkTheme: true,
        autoStart: false,
        toTray: false,
        center: true,
        analytics: true
      },
      bounds: {
        height: null,
        width: null,
        x: null,
        y: null
      },
      video: {
        inside: true,
        autoplay: true,
        fullscreen: false,
        preferredLanguage: 'en',
        quality: '720p'
      },
      torrentClient: {
        defaultPath: downloadPath,
        streamingPath: tmpPath
      }
    }
  }
}
