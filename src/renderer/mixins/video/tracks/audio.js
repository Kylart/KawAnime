export default {
  computed: {
    audio () {
      return Object.values(this.tracks)
        .filter(({ type }) => type === 'audio')
    },
    hasAudio () {
      return !!this.audio.length
    },
    selectedAudio () {
      return this.audio.find(({ selected }) => selected)
    },

    audios () {
      return {
        tracks: this.audio,
        has: this.hasAudio,
        current: this.selectedAudio
      }
    }
  }
}
