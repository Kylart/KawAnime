import { fansubs, sounds, subtitlesLanguages, qualities } from '../lists.js'

export default {
  config: {
    fansub: 'HorribleSubs',
    quality: '720p',
    feed: 'si',
    localPath: '',
    sound: 'Nyanpasu',
    inside: true,
    magnets: false,
    system: {
      autoStart: false,
      toTray: false
    },
    video: {
      inside: true,
      autoplay: true,
      fullscreen: false,
      preferredLanguage: 'en',
      quality: '720p'
    }
  },
  fansubs,
  qualities,
  sounds,
  subtitlesLanguages
}
