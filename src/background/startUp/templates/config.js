import { app } from 'electron'

export default {
  filename: 'config.json',
  template: {
    config: {
      fansub: 'HorribleSubs',
      quality: '720p',
      feed: 'si',
      infoProvider: 'mal',
      localPath: app.getPath('downloads'),
      sound: 'Nyanpasu',
      notificationVolume: 0.5,
      inside: true,
      system: {
        darkTheme: true,
        autoStart: false,
        toTray: false,
        center: true
      },
      bounds: {
        height: null,
        width: null,
        x: null,
        y: null
      },
      version: '0.0.0',
      video: {
        inside: true,
        autoplay: true,
        fullscreen: false,
        preferredLanguage: 'en',
        quality: '720p'
      },
      torrentClient: {
        defaultPath: app.getPath('downloads')
      }
    }
  }
}
