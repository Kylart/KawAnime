export default {
  async mounted () {
    if (!this.info.hasOwnProperty('episodesLinks')) {
      await this.$store.dispatch('info/getEpsLinks', this.current)
    }

    // Making a computed property would probably be better
    // but I failed to successfullly get one to refresh whenever
    // it should so..
    this.epLinks = this.info.episodesLinks || {}
  },

  data: ({
    epQuality: {},
    epLinks: {}
  })
}
