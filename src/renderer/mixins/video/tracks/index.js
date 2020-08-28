import Subtitles from './subtitles.js'
import Audio from './audio.js'

export default {
  mixins: [
    Subtitles,
    Audio
  ],

  data: () => ({
    tracks: {}
  }),

  methods: {
    /**
     * Will setup listeners for the track information
     *
     * @param {Number} value Number of available tracks
     */
    observeTracks (value) {
      if (!value) return
      for (let i = 1; i <= value; ++i) {
        this.mpv.observe(`track-list/${i}/type`)
        this.mpv.observe(`track-list/${i}/lang`)
        this.mpv.observe(`track-list/${i}/default`)
        this.mpv.observe(`track-list/${i}/id`)
        this.mpv.observe(`track-list/${i}/type`)
        this.mpv.observe(`track-list/${i}/src`)
        this.mpv.observe(`track-list/${i}/title`)
        this.mpv.observe(`track-list/${i}/lang`)
        this.mpv.observe(`track-list/${i}/selected`)
      }
    },
    handleTracks (propertyName, value) {
      if (propertyName === 'track-list/count') this.observeTracks(value)
      // Condition only to be sure...
      else if (propertyName.match(/track-list\/\d+/)) {
        const parts = propertyName.split('/')
        const trackNumber = +parts[1]
        const type = parts[2]

        const isStored = !!this.tracks[trackNumber]

        if (isStored) {
          this.$set(this.tracks[trackNumber], type, value)
        } else {
          this.$set(this.tracks, trackNumber, { [type]: value })
        }
      }
    },

    getTrackIndex (track) {
      return Object.entries(this.tracks)
        .find(([index, _track]) => _track.type === track.type && _track.id === track.id)[0]
    },

    setTrack (track) {
      const { selected, id, type } = track
      const isAudio = type === 'audio'
      const property = isAudio ? 'aid' : 'sid'

      const currentTrack = isAudio ? this.audios.current : this.subtitles.current

      if (currentTrack) {
        const currentTrackIndex = this.getTrackIndex(currentTrack)
        this.$set(
          this.tracks,
          currentTrackIndex, {
            ...this.tracks[currentTrackIndex],
            selected: false
          }
        )
      }

      if (selected) {
        // Disabling selected track
        this.mpv.property(property, 'no')
      } else {
        // Enabling new track
        this.mpv.property(property, id)

        // Because MPV does not send the event anymore?
        const newTrackIndex = this.getTrackIndex(track)
        this.$set(
          this.tracks,
          newTrackIndex, {
            ...this.tracks[newTrackIndex],
            selected: true
          }
        )
      }
    }
  }
}
