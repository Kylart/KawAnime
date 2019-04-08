export default {
  methods: {
    handleTorrentOpen (e, data) {
      const torrents = JSON.parse(data)

      this.$log('Received torrent to open!', torrents)

      this.$router.push({
        path: this.$router.currentRoute.fullPath,
        query: { torrents }
      })

      this.$nextTick(() => this.$store.commit('torrents/showDialog', true))
    }
  }
}
