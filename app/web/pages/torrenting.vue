<template lang="pug">
  v-container(grid-list-md, fluid)
    v-layout(row, wrap, justify-center, align-center)
      torrent-header(:client='client')
      v-flex(v-for='(torrent, index) in torrents', :key='index', xs12, sm6, xl4)
        card(:torrent='torrent')
</template>

<script>
import Card from 'components/torrents/card.vue'
import TorrentHeader from 'components/torrents/header.vue'

export default {
  name: 'Torrent-Page',

  components: {
    Card,
    TorrentHeader
  },

  async mounted () {
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
    }
  }
}
</script>
