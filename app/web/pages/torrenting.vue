<template lang="pug">
  v-container(grid-list-md, fluid)
    v-layout(row, wrap, justify-center, align-center)
      torrent-header
      template(v-if='torrents.length')
        client-info
        v-flex(v-for='(torrent, index) in torrents', :key='index', xs12, sm6, xl4)
          card(:torrent='torrent')
      template(v-else)
        empty
</template>

<script>
import Card from 'components/torrents/card.vue'
import TorrentHeader from 'components/torrents/header.vue'
import ClientInfo from 'components/torrents/clientInfo.vue'
import Empty from 'components/torrents/empty.vue'

export default {
  name: 'Torrent-Page',

  components: {
    Card,
    TorrentHeader,
    ClientInfo,
    Empty
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
  }
}
</script>
