<template lang="pug">
  v-container
    v-layout(row, wrap)
      template(v-for='torrent in torrents')
        v-flex(xs12) {{ torrent }}
</template>

<script>
export default {
  name: 'Torrent-Page',

  mounted () {
    setInterval(this.getInfo, 500)
  },

  computed: {
    client: {
      get () {
        return this.$store.state.torrents.client
      },
      set () {}
    },
    torrents: {
      get () {
        return this.$store.state.torrents.torrents
      },
      set () {}
    }
  },

  methods: {
    async getInfo () {
      await this.$store.dispatch('torrents/getData')
    },
    async actOnTorrent (magnet, action) {
      try {
        await this.$axios.get('torrent/toggle', {
          params: {
            action,
            magnet
          }
        })

        this.getInfo()
      } catch (e) { void e }
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
