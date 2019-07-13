import { parseSubtitles } from './ass'

export default {
  created () {
    this.toggleSubHandlers(true)
  },

  beforeDestroy () {
    this.toggleSubHandlers(false)
  },

  methods: {
    addSubtitle (data) {
      // this.tracks comes from tracks mixins
      const { trackNumber, subtitle } = data

      if (trackNumber in this.tracks) {
        if (this.isAss) {
          const cue = parseSubtitles(subtitle, this.styles, this.info)
          const isIn = this.tracks[trackNumber].findIndex(({ masterId }) => cue.masterId === masterId) !== -1

          !isIn && this.tracks[trackNumber].push(cue)
        } else {
          const cue = new window.VTTCue(subtitle.time / 1000, (subtitle.time + subtitle.duration) / 1000, subtitle.text)

          this.tracks[trackNumber].addCue(cue)
        }
      }
    },
    toggleSubHandlers (bool) {
      const methodName = bool ? 'on' : 'removeListener'

      this.$ipc[methodName](this.$eventsList.video.tracks.success, this.handleTracksSuccess)
      this.$ipc[methodName](this.$eventsList.video.subtitles.success, this.handleSubsSuccess)
      this.$ipc[methodName](this.$eventsList.video.name.success, this.handleNameSuccess)
    },

    handleTracksSuccess (e, tracks) {
      this.handleTracks(tracks)
      this.$refs.layout.updateSubtitlesData()
    },
    handleSubsSuccess (e, data) {
      this.addSubtitle(data)
    },
    handleNameSuccess (e, name) {
      this.name = name

      this.addToHistory()
    }
  }
}
