<template lang="pug">
  v-container(grid-list-md, fluid)
    v-layout(row, wrap, justify-center, align-center)
      torrent-header(:client='client')
      template(v-if='torrents.length')
        v-flex(v-for='(torrent, index) in torrents', :key='index', xs12, sm6, xl4)
          card(:torrent='torrent')
      template(v-else)
        empty
</template>

<script>
import Card from 'components/torrents/card.vue'
import TorrentHeader from 'components/torrents/header.vue'
import Empty from 'components/torrents/empty.vue'

export default {
  name: 'Torrent-Page',

  components: {
    Card,
    TorrentHeader,
    Empty
  },

  async mounted () {
    setInterval(this.getInfo, 1000)
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
