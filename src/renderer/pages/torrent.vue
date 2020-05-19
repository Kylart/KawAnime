<template lang="pug">
  v-container(fluid)

    torrent-header.mb-2

    v-fade-transition(group)
      template(v-if='torrents.length')
        v-row(key='torrents')
          client-info(:client='client')

          torrents-display(:torrents='torrents')

      template(v-else)
        empty(key='empty')
</template>

<script>
import { mapState } from 'vuex'

import TorrentHeader from '@/components/torrent/page/header.vue'
import ClientInfo from '@/components/torrent/page/clientInfo.vue'
import TorrentsDisplay from '@/components/torrent/page/display.vue'
import Empty from '@/components/torrent/page/empty.vue'

export default {
  name: 'Torrent-Page',

  components: {
    TorrentHeader,
    ClientInfo,
    TorrentsDisplay,
    Empty
  },

  computed: {
    ...mapState('torrents', [
      'client',
      'torrents'
    ])
  }
}
</script>
