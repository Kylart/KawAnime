<template lang="pug">
  v-card
    v-layout(row, wrap, column)
      v-flex.ellipsis(xs2)
        span(v-show='torrent && torrent.files && torrent.files[0]').torrent-title {{ torrent.files[0].name }}

      v-flex(xs1, pl-4, pr-2, d-flex, justify-space-between, align-center)
        v-progress-linear(v-model='progress', height='5', color='indigo')
        span.progress-text {{ progress }}%
        span.progress-text {{ timeRemaining }}
      v-flex(xs2)
        v-layout(justify-space-around, pl-4, pr-4)
          template(v-for='action in actions')
            v-btn(icon, @click='action.action')
              v-icon(:color='action.color') {{ action.icon }}
</template>

<script>
import moment from 'moment'

export default {
  name: 'Torrent-Card',

  props: ['torrent'],

  data () {
    return {
      isPaused: false,
      creationDate: null,
      timeRemaining: ''
    }
  },

  created () {
    this.creationDate = moment()
  },

  computed: {
    progress () {
      return this.torrent
        ? (this.torrent.progress * 100).toFixed(2)
        : 0
    },
    actions () {
      return [{
        icon: this.isPaused ? 'play_arrow' : 'stop',
        color: '',
        action: () => this.actOnTorrent(this.isPaused ? 'resume' : 'pause')
      }, {
        icon: 'delete',
        color: 'red',
        action: () => this.actOnTorrent('destroy')
      }, {
        icon: 'info',
        color: '',
        action: this.displayInfo
      }]
    }
  },

  methods: {
    setRemainingTime (torrent) {
      this.timeRemaining = torrent.timeRemaining
        ? 'Ends ' + this.creationDate.add(torrent.timeRemaining).fromNow()
        : ''
    },
    async actOnTorrent (action) {
      await this.$axios.get('torrent/act', {
        params: {
          magnet: this.torrent.magnetURI,
          action
        }
      })

      if (action === 'destroy') this.actOnTorrent('pause').then(this.$destroy)
      else if (action === 'pause') this.isPaused = true
      else if (action === 'resume') this.isPaused = false
    },
    displayInfo () {

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
    font-size 16px
    font-weight 300
    letter-spacing 0.02em
    padding 0 8px
</style>
