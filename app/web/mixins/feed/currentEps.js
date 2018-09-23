export default {

  async mounted () {
    if (!this.info.hasOwnProperty('episodesLinks')) {
      await this.$store.dispatch('info/getEpsLinks', {
        name: this.current.title,
        config: {
          fansub: this.current.releaseGroup || this.config.fansub,
          feed: this.config.feed
        }
      })
    }

    // Making a computed property would probably be better
    // but I failed to successfullly get one to refresh whenever
    // it should so..
    this.epLinks = this.info.episodesLinks || {}
    this.setEpQualities()
    this.setEpsQuality()
    this.groupEps()
  },

  data: () => ({
    epsQuality: {},
    epQualities: {},
    epLinks: {},
    epsList: [],
    qualityEpMap: {}
  }),

  computed: {
    config: {
      get () {
        return this.$store.state.releases.params
      },
      set () {}
    }
  },

  methods: {
    groupEps () {
      const qualityMap = {}
      const epsList = []

      this.epLinks.magnets.forEach((magnet) => {
        const ep = magnet.nb
        const quality = magnet.quality

        if (!qualityMap.hasOwnProperty(ep)) {
          qualityMap[ep] = {}
        }

        qualityMap[ep][quality] = magnet.link

        const isEpThere = epsList.includes(ep)

        if (!isEpThere) {
          epsList.push(ep)
        }
      })

      this.$set(this, 'qualityEpMap', qualityMap)
      this.$set(this, 'epsList', epsList.sort((a, b) => a - b).reverse())
    },
    setEpQualities () {
      // We have to know which qualities are available for each available episode.
      this.epLinks.magnets.forEach((magnet) => {
        const quality = magnet.quality
        const ep = magnet.nb

        if (!this.epQualities.hasOwnProperty(ep)) {
          this.epQualities[ep] = []
        }

        this.epQualities[ep].push(quality)
        this.epQualities[ep] = this.epQualities[ep]
          .sort((a, b) => parseInt(a.replace('p')) - parseInt(b.replace('p'))).reverse()
      })
    },
    setEpsQuality () {
      // We have to assign the default quality for each episode.
      // Based on the configuration first or the one in the middle as fallback.
      this.epLinks.magnets.forEach((magnet) => {
        const ep = magnet.nb

        // magnets will probably includes the same episode several times
        // only with a different quality. we need only one to deduce the
        // preferable quality.
        if (this.epsQuality[ep]) return

        const qualities = this.epQualities[ep]

        this.epsQuality[ep] = qualities.includes(this.config.quality)
          ? this.config.quality
          : qualities[Math.ceil(qualities / 2)]
      })
    },
    getMagnet (ep) {
      const selectedQuality = this.epsQuality[ep]
      return this.qualityEpMap[ep][selectedQuality]
    },
    watch (ep) {
      const magnet = this.getMagnet(ep)
      const { title } = this.current

      this.$store.commit('streaming/play', {
        show: true,
        link: {
          link: magnet,
          name: `${title} - ${ep}`
        }
      })
    },
    async download (ep) {
      const magnet = this.getMagnet(ep)

      await this.$axios.get('openThis', {
        params: {
          type: 'link',
          link: magnet
        }
      })
    }
  }
}
