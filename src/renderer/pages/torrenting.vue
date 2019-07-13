<template lang="pug">
  v-container(grid-list-md, fluid)
    torrent-header.mb-2
    transition(name='fade', mode='out-in', tag='div').layout.row.wrap.justify-center.align-center
      template(v-if='torrents.length')
        .layout.row.wrap.justify-center.align-center
          client-info(key='client-info')
          transition-group(name='list', mode='out-in', tag='div').layout.row.wrap.justify-center.align-center
            v-flex(v-for='(torrent, index) in torrents', :key='torrent.infoHash', xs12, sm6, md4, xl3)
              card(:torrent='torrent')
      template(v-else)
        empty(key='empty')
</template>

<script>
import Card from '@/components/torrents/card.vue'
import TorrentHeader from '@/components/torrents/header.vue'
import ClientInfo from '@/components/torrents/clientInfo.vue'
import Empty from '@/components/torrents/empty.vue'

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
