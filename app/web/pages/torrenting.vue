<template lang="pug">
  v-container(grid-list-md)
    v-layout(row, wrap, justify-center, align-center)
      v-flex(v-for='(torrent, index) in torrents', :key='index', xs12, sm6, xl4)
        card(:torrent='torrent')
</template>

<script>
import Card from 'components/torrents/card.vue'

export default {
  name: 'Torrent-Page',

  components: {
    Card
  },

  async mounted () {
    setInterval(this.getInfo, 500)

    await this.$store.dispatch('torrents/addTorrent', 'magnet:?xt=urn:btih:37e7fae70851f74eedce47357954994ac5a0e4a5&dn=%5BHorribleSubs%5D%20Watashi%20ni%20Tenshi%20ga%20Maiorita%21%20-%2006%20%5B720p%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce')
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
