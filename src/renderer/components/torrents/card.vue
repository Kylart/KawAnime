<template lang="pug">
  v-card.pa-2
    v-layout(row, wrap, column)
      v-tooltip(top, v-show='torrentName')
        template(v-slot:activator='{ on }')
          .torrent-title.ellipsis.pt-1.pb-2(v-on='on') {{ torrentName }}
        span {{ torrentName }}

      v-divider

      v-flex(pl-4, pr-2, pt-3, pb-0, d-flex, justify-space-between, align-center)
        v-progress-linear(:value='progress', height='12', color='green')
        .progress-text {{ progress }}%

      v-flex(pt-0, pr-2, pb-2, d-flex, justify-end)
        .progress-text.time-remaining.grey--text.text-uppercase.text-xs-right {{ timeRemaining }}

      v-divider

      v-layout(justify-space-around, pl-6, pr-6)
        template(v-for='action in actions')
          v-flex(d-flex, justify-center)
            v-btn(v-if='!action.displayInfo', icon, @click='action.action', large)
              v-icon(:color='action.color', large) {{ action.icon }}
        //- v-flex(d-flex, justify-center)
        //-   torrent-info(:torrent='torrent')
</template>

<script>
import moment from 'moment'

import TorrentInfo from '@/components/torrents/torrentInfo.vue'

export default {
  name: 'Torrent-Card',

  components: { TorrentInfo },

  props: ['torrent'],

  data: () => ({
    isPaused: false,
    timeRemaining: ''
  }),

  computed: {
    torrentName () {
      return this.torrent.name
    },
    progress () {
      return (this.torrent.progress * 100).toFixed(2)
    },
    actions () {
      return [{
        icon: this.isPaused ? 'play_arrow' : 'stop',
        color: '',
        action: () => this.actOnTorrent(this.isPaused ? 'resume' : 'pause')
      }, {
        icon: 'delete',
        color: 'red',
        action: this.stop
      }]
    }
  },

  methods: {
    stop () {
      this.actOnTorrent('destroy')
    },
    setRemainingTime (torrent) {
      if (torrent.progress === 1) {
        this.timeRemaining = 'Done'
        return
      }

      const endsIn = parseInt(Date.now() + torrent.timeRemaining)

      this.timeRemaining = torrent.timeRemaining
        ? 'Ends ' + moment(endsIn).fromNow()
        : 'Unknown time remaining...'
    },
    actOnTorrent (action) {
      this.$ipc.send(this.$eventsList.torrent.act.main, {
        torrent: this.torrent,
        action
      })

      if (action === 'pause') this.isPaused = true
      else if (action === 'resume') this.isPaused = false
    }
  },

  watch: {
    torrent (torrent) {
      this.setRemainingTime(torrent)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .torrent-title
    font-size 18px
    font-weight 500
    letter-spacing 0.04em
    padding 0 12px

  .progress-text
    white-space nowrap
    font-size 16px
    font-weight 300
    letter-spacing 0.02em
    padding 0 8px

  .time-remaining
    font-size 12px !important
</style>
