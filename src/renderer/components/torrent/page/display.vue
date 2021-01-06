<template lang="pug">
  v-container(fluid)
    v-data-table(
      :headers='headers',
      :items='torrents',
      :expanded.sync='expanded',
      item-key='id',
      show-expand
    )

      template(v-slot:item.actions='{ item }')
        td.d-flex.align-center
          v-btn(icon, @click="actOnTorrent(item.isPaused ? 'resume' : 'pause', item)")
            v-icon {{ item.isPaused ? 'play_arrow' : 'stop' }}

          v-btn(icon, @click="actOnTorrent('destroy', item)")
            v-icon(color='red') delete

      template(v-slot:item.name='{ item }')
        td.ellipsis {{ item.name }}

      template(v-slot:item.progress='{ item }')
        v-progress-linear(
          :value='item.progress * 100',
          buffer-value='0',
          rounded,
          height='15',
          color='green'
        )
          template(v-slot='{ value }')
            strong {{ Math.floor(value) }}%

      template(v-slot:item.timeRemaining='{ item }')
        td.ellipsis {{ getRemainingTime(item) }}

      template(v-slot:expanded-item='{ headers, item }')
        td(:colspan='headers.length')
          torrent-info(:torrent='item')
</template>

<script>
import moment from 'moment'

import TorrentInfo from '@/components/torrent/page/torrentInfo.vue'

export default {
  name: 'Torrent-Display',

  components: {
    TorrentInfo
  },

  props: {
    torrents: {
      type: Array[Object]
    }
  },

  data: () => ({
    expanded: [],
    headers: [
      { text: 'Actions', value: 'actions', sortable: false },
      { text: 'Name', value: 'name', sortable: true, align: 'start' },
      { text: 'Progress', value: 'progress', sortable: true, align: 'center' },
      { text: 'Time Remaining', value: 'timeRemaining', sortable: true, align: 'center' },
      { text: 'Status', value: 'state', sortable: true, align: 'center' },
      { text: 'Peers', value: 'numPeers', sortable: true, align: 'center' },
      { text: '', value: 'data-table-expand' }
    ]
  }),

  methods: {
    actOnTorrent (action, torrent) {
      this.$ipc.send(this.$eventsList.torrent.act.main, {
        torrent: torrent,
        action
      })
    },

    getRemainingTime (torrent) {
      if (torrent.progress === 1) return 'Done'

      const endsIn = parseInt(Date.now() + torrent.timeRemaining)

      return torrent.timeRemaining
        ? moment(endsIn).fromNow()
        : 'Unknown...'
    }
  }
}
</script>
