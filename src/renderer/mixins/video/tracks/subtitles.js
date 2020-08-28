export default {
  computed: {
    subs () {
      return Object.values(this.tracks)
        .filter(({ type }) => type === 'sub')
    },
    hasSubs () {
      return !!this.subs.length
    },
    selectedSub () {
      return this.subs.find(({ selected }) => selected)
    },

    subtitles () {
      return {
        tracks: this.subs,
        has: this.hasSubs,
        current: this.selectedSub
      }
    }
  }
}
