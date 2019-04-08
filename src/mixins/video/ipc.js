export default {
  created () {
    this.toggleSubHandlers(true)
  },

  beforeDestroy () {
    this.toggleSubHandlers(false)
  },

  methods: {
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
