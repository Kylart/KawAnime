<template lang="pug">
  v-container(fluid)
    v-row(justify='space-around', align='center')
      template(v-for='caption in captions')
        .caption
          caption.grey--text.text-uppercase {{ caption.text }}

          template(v-if='caption.unit')
            div
              span.display-1 {{ caption.value.value }}
              strong {{ caption.value.unit }}
              strong(v-if='caption.perSec') /s

          template(v-else)
            .display-1 {{ caption.value }}

    v-row
      v-container(fluid)
        v-card
          v-card-title
            span Files
            v-spacer
            v-btn(icon, @click='open')
              v-icon open_in_new

          v-divider

          v-card-text
            template(v-for='file in torrent.files')
              .file(:key='file.path')
                v-tooltip(top)
                  template(v-slot:activator='{ on }')
                    v-container.py-0(fluid, v-on='on')
                      span.body-2.ellipsis {{ file.path }}

                  span {{ getFullPath(file) }}
</template>

<script>
import { sep } from 'path'

export default {
  name: 'Torrent-Info',

  props: ['torrent'],

  data: () => ({
    sizes: ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  }),

  computed: {
    captions () {
      return [
        { text: 'Peers', value: this.torrent.numPeers },
        { text: 'Files', value: this.torrent.files.length },
        { text: 'Size', value: this.formatBytes(this.totalLength), unit: true },
        { text: 'Download Speed', value: this.formatBytes(this.torrent.downloadRate), unit: true, perSec: true },
        { text: 'Upload Speed', value: this.formatBytes(this.torrent.uploadRate), unit: true, perSec: true }
      ]
    },

    totalLength () {
      return this.torrent.files.reduce((acc, { size }) => (acc + size), 0)
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
        unit: this.sizes[i]
      }
    },

    getFullPath (file) {
      return [
        this.torrent.path,
        file.path
      ].join(sep)
    },

    open (file) {
      this.$electron.shell.openItem(this.torrent.path)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .caption
    padding 0 12px
    display flex
    justify-content center
    align-items center
    flex-direction column
</style>
