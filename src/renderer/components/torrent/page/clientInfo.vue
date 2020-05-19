<template lang="pug">
  v-container(fluid)
    v-card
      v-card-title Overall information

      v-divider

      v-card-text
        .d-flex.flex-column.align-start

          v-container(fluid)
            v-row.speeds-container(justify='space-between')
              template(v-for='speedName in speeds')
                .captions
                  caption.grey--text.text-uppercase {{ speedName.text }}

                  div
                    span.display-1 {{ currentSpeed[speedName.value].value }}
                    strong(v-if='currentSpeed[speedName.value]') {{ currentSpeed[speedName.value].unit }}

          v-container.px-8(fluid)
            v-sparkline(
              height='75',
              :key='graph.current',
              :smooth='16',
              :gradient='["#f72047", "#ffd200", "#1feaea"]',
              :line-width='1',
              :value='graph.values',
              :fill='graph.fill',
              auto-draw,
              stroke-linecap='round'
            )
</template>

<script>
export default {
  name: 'Torrent-Client',

  props: [
    'client'
  ],

  data: () => ({
    speeds: [
      { value: 'download', text: 'Download speed' },
      { value: 'upload', text: 'Upload speed' },
      { value: 'ratio', text: 'Ratio' },
      { value: 'progress', text: 'Progress' },
      { value: 'nbTorrents', text: 'Torrents' },
      { value: 'peers', text: 'Peers' }
    ],
    sizes: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    graph: {
      current: null,
      values: [0, 0]
    }
  }),

  computed: {
    currentSpeed () {
      return {
        download: this.formatBytes(this.client.downloadRate),
        upload: this.formatBytes(this.client.uploadRate),
        ratio: { value: `${((this.client.ratio || 0) * 100).toFixed(2)}%`, unit: '' },
        progress: { value: `${(this.client.progress * 100).toFixed(2)}%`, unit: '' },
        nbTorrents: { value: this.client.nbTorrents, unit: '' },
        peers: { value: this.client.peers, unit: '' }
      }
    }
  },

  methods: {
    formatBytes (bytes) {
      // https://stackoverflow.com/questions/1590i88888340485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
      if (bytes === 0) return { value: 0, unit: 'Bytes' }

      const k = 1024
      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return {
        value: parseFloat((bytes / Math.pow(k, i)).toFixed(2)),
        unit: this.sizes[i] + '/s'
      }
    },
    addGraphValue (client) {
      const { downloadRate: value } = client

      if (+value) this.graph.values.push(value)
    }
  },

  watch: {
    currentSpeed () {
      this.addGraphValue(this.client)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .title-text
    font-size 24px
    letter-spacing 0.04em
    text-align center
    font-weight 500

  .captions
    display flex
    flex-direction column
    justify-content space-around
    align-items center
</style>
