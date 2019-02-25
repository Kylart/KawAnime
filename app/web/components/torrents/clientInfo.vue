<template lang="pug">
  v-flex(xs12, mb-2)
    v-card.pt-0.pl-4.pr-4.pb-4
      v-card-title.title-text.text-uppercase Overall information

      v-divider

      v-layout(
        column,
        align-start,
        pt-4
      )

        v-layout.speeds-container(justify-space-between)
          template(v-for='speedName in speeds')
            div.captions
              caption.grey--text.text-uppercase {{ speedName.text }}

              div
                span.display-1.font-weight-black {{ currentSpeed[speedName.value].value }}
                strong(v-if='currentSpeed[speedName.value]') {{ currentSpeed[speedName.value].unit }}

        .graph
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

  data: () => ({
    speeds: [
      { value: 'download', text: 'Download speed' },
      { value: 'upload', text: 'Upload speed' },
      { value: 'ratio', text: 'Ratio' },
      { value: 'progress', text: 'Progress' },
      { value: 'nbTorrents', text: 'Torrents' }
    ],
    sizes: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    graph: {
      current: null,
      values: [0, 0]
    }
  }),

  computed: {
    client: {
      get () {
        return this.$store.state.torrents.client
      },
      set () {}
    },
    currentSpeed () {
      return {
        download: this.formatBytes(this.client.downloadSpeed),
        upload: this.formatBytes(this.client.uploadSpeed),
        ratio: { value: `${(this.client.ratio * 100).toFixed(2)}%`, unit: '' },
        progress: { value: `${(this.client.progress * 100).toFixed(2)}%`, unit: '' },
        nbTorrents: { value: this.client.nbTorrents, unit: '' }
      }
    }
  },

  methods: {
    formatBytes (bytes, decimals) {
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
      const { downloadSpeed: value } = client

      if (+value) {
        // this.graph.current = value
        this.graph.values.push(value)
      }
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

  .speeds-container
    width 100%
    padding 0 15%

  .captions
    display flex
    flex-direction column
    justify-content space-around
    align-items center

  .graph
    width 100%
    padding 0 25%
</style>
