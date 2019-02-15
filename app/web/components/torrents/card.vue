<template lang="pug">
  v-card
    v-layout(row, wrap, column)
      v-flex.ellipsis(xs2)
        span(v-show='torrent && torrent.files && torrent.files[0]').torrent-title {{ torrent.files[0].name }}

      v-flex(xs7, pl-4, pt-2)
        v-layout(
          column,
          align-start
        )

          v-layout.speeds-container(justify-space-between)
            template(v-for='speedName in speeds')
              div
                caption.grey--text.text-uppercase {{ speedName }} Speed

                div
                  span.display-2.font-weight-black {{ currentSpeed[speedName].value }}
                  strong(v-if='currentSpeed[speedName]') {{ currentSpeed[speedName].unit }}/s

          v-sheet.v-sheet--offset.mx-auto
            v-sparkline(
              :key='graph.current',
              :smooth='16',
              :gradient='["#f72047", "#ffd200", "#1feaea"]',
              :line-width='1',
              :value='graph.values',
              :fill='graph.fill',
              auto-draw,
              stroke-linecap='round'
            )
      v-flex(xs1, pl-4, pr-2, d-flex, justify-space-between, align-center)
        v-progress-linear(v-model='progress', height='5', color='indigo')
        span.progress-text {{ progress }}%
        span.progress-text {{ timeRemaining }}
      v-flex(xs2)
        v-layout(justify-space-around, pl-4, pr-4)
          template(v-for='action in actions')
            v-btn(v-show='action.condition', icon, @click='action.action')
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
      timeRemaining: '',
      speeds: ['download', 'upload'],
      sizes: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      graph: {
        current: null,
        values: [0, 0],
        labels: ['start', new Date().toLocaleTimeString()],
        fill: false
      },
      actions: [{
        icon: 'play_arrow',
        color: '',
        condition: this.isPaused,
        action: () => this.actOnTorrent('resume')
      }, {
        icon: 'stop',
        color: '',
        condition: !this.isPaused,
        action: () => this.actOnTorrent('pause')
      }, {
        icon: 'delete',
        color: 'red',
        condition: true,
        action: () => this.actOnTorrent('destroy')
      }, {
        icon: 'info',
        color: '',
        condition: true,
        action: this.displayInfo
      }]
    }
  },

  created () {
    this.creationDate = moment()
  },

  mounted () {
    this.addGraphValue(this.torrent)
  },

  computed: {
    progress () {
      return this.torrent
        ? (this.torrent.progress * 100).toFixed(2)
        : 0
    },
    currentSpeed () {
      if (!this.torrent) return null

      return {
        download: this.formatBytes(this.torrent.downloadSpeed),
        upload: this.formatBytes(this.torrent.uploadSpeed)
      }
    }
  },

  methods: {
    setRemainingTime (torrent) {
      this.timeRemaining = torrent.timeRemaining
        ? 'Ends ' + this.creationDate.add(torrent.timeRemaining).fromNow()
        : ''
    },
    addGraphValue (torrent) {
      if (torrent.progress < 1) {
        const { downloadSpeed: value } = torrent
        this.graph.values.push(value)
        this.graph.labels.push(new Date().toLocaleTimeString())
      }
    },
    formatBytes (bytes, decimals) {
      // https://stackoverflow.com/questions/1590i88888340485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
      if (bytes === 0) return { value: 0, unit: 'Bytes' }

      const k = 1024
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return {
        value: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
        unit: this.sizes[i]
      }
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
      this.addGraphValue(torrent)
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

  .speeds-container
    width 100%
    padding 0 15%

  .progress-text
    font-size 16px
    font-weight 300
    letter-spacing 0.02em
    padding 0 8px
</style>
