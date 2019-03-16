export default {
  data: () => ({
    eventSource: null
  }),

  mounted () {
    this.eventSource = new window.EventSource(`/external`)

    this.$_.each(
      this.listeners,
      (handler, eventName) => this.eventSource.addEventListener(eventName, handler)
    )
  },

  computed: {
    listeners () {
      return {
        'torrent': this.handleTorrent
      }
    }
  },

  methods: {
    handleTorrent (e) {
      const { data } = e

      this.$log('Received torrent to open!', data)

      this.$router.push({
        path: this.$router.currentRoute.fullPath,
        query: { torrents: JSON.parse(data) }
      })

      this.$nextTick(() => this.$store.commit('torrents/showDialog', true))
    }
  }
}
