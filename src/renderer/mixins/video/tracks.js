import { setStyles, tracks } from './ass'
import Timing from './timing.js'

export default {
  mixins: [ Timing ],

  data: () => ({
    isStyleSet: false,
    language: null,
    trackNumber: 0,
    tracks: {},
    numToLang: {},
    isPrefLanguageSet: false,
    isAss: false,
    styles: null,
    info: null
  }),

  computed: {
    currentTrack () {
      return this.tracks[this.trackNumber]
    },
    currentLang () {
      return this.numToLang[this.trackNumber]
    }
  },

  methods: {
    setStyles,
    parseTrack: tracks,
    setTrack (num) {
      this.trackNumber = this.trackNumber === +num ? null : +num
    },
    handleTracks (tracks) {
      if (typeof tracks !== 'object') tracks = JSON.parse(tracks)

      tracks.forEach((track) => {
        const language = (track.language || 'eng').slice(0, 2)
        const trackNumber = +track.number

        if (this.tracks[trackNumber]) return

        this.tracks[trackNumber] = []
        this.numToLang[trackNumber] = language

        // We might have to handle multiple track format in the future.
        // But there is probably no way that a file features two subtitle
        // formats.
        if (track.type === 'ass') {
          this.isAss = true
        }

        // this.config coming from main component
        if (!this.isPrefLanguageSet && language === this.config.preferredLanguage) {
          this.isPrefLanguageSet = true
          this.trackNumber = trackNumber
        }
      })

      if (this.isAss) {
        // We now have to parse this track.
        const parsedTrack = this.parseTrack(tracks)

        this.styles = parsedTrack.styles
        this.info = parsedTrack.info

        // Let's suppose each track have the same style and that only the language of each changes.
        if (!this.isStyleSet) {
          // this.value comes from main component
          this.setStyles(this.styles, this.value, this.info)
          this.isStyleSet = true
        }
      }

      // Setting default language
      if (tracks.length === 1 && !this.isPrefLanguageSet) {
        this.trackNum = +Object.keys(this.numToLang)[0]
      }
    }
  }
}
