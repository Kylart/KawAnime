<template lang="pug">
  div
    v-card.elevation-12.mb-3
      v-card-title.section-title Torrent client configuration

    v-card.elevation-12.mb-3
      v-card-title.section-title Download settings
      v-divider
      v-card-text
        v-container(grid-list-lg, pa-0)
          v-layout(row, wrap, justify-center, align-center)
            v-flex(xs12, sm4, md2)
              v-btn(flat, @click='openDialog') Change Dir
            v-flex(xs12, sm8, md8)
              .path.ellipsis.pl-2 {{ path }}
            v-flex(xs12, sm6, md4)
              v-btn(:disabled='isDefault', :loading='defaultLoading', @click='setDefault') {{ defaultLabel }}

    v-card.elevation-12
      v-card-title.section-title Streaming settings
      v-divider
      v-card-text
        v-container(grid-list-lg, pa-0)
          v-layout(justify-space-around, align-center)
            v-btn(flat, @click="openDialog('streaming')") Change Dir
            .path.ellipsis.pl-2 {{ streamingPath }}
            v-tooltip(top, lazy)
              v-btn(icon, slot='activator', @click='openStreamingFolder')
                v-icon open_in_new
              span Open
            v-tooltip(top, lazy)
              v-btn(icon, slot='activator', @click='resetToTmp')
                v-icon(large) refresh
              span Reset to temporary folder
      v-card-actions
        v-spacer
        v-layout(column, align-end)
          .conditions When streaming, the file is temporarely kept on your computer
          .conditions You can keep those if you choose another folder that the temporary one
</template>

<script>
// Mixins
import Update from '@/mixins/config/update.js'

export default {
  name: 'Torrent-Section',

  mixins: [ Update ],

  data: () => ({
    isDefault: false,
    defaultLoading: false,
    protocols: ['magnet', 'stream-magnet']
  }),

  mounted () {
    const { app } = this.$electron.remote

    this.isDefault = this.protocols.every((protocol) => app.isDefaultProtocolClient(protocol))
  },

  computed: {
    streamingPath: {
      get () {
        return this.config.torrentClient.streamingPath
      },
      set (val) {
        this.setDeepValue('torrentClient.streamingPath', val)
      }
    },
    path: {
      get () {
        return this.config.torrentClient.defaultPath
      },
      set (val) {
        this.setDeepValue('torrentClient.defaultPath', val)
      }
    },
    defaultLabel () {
      return this.isDefault
        ? 'KawAnime is already your default client!'
        : 'Set as default client'
    }
  },

  methods: {
    resetToTmp () {
      this.streamingPath = this.$electron.remote.app.getPath('temp')
    },
    openStreamingFolder () {
      this.$electron.shell.openItem(this.streamingPath)
    },
    async openDialog (typ) {
      const path = await this.$openDialog()

      if (path) this[typ === 'streaming' ? 'streamingPath' : 'path'] = path
    },
    async setDefault () {
      this.$log('Registering as default torrent app...')
      this.defaultLoading = true

      const { app } = this.$electron.remote
      const isOk = this.protocols
        .map((protocol) => app.setAsDefaultProtocolClient(protocol, process.platform === 'darwin' ? undefined : app.getPath('exe')))
        .every(Boolean)

      if (isOk) {
        this.$log('Success!')
        this.isDefault = true
      } else {
        this.$log('Failure.')
        this.$store.commit('setInfoSnackbar', 'Could not register as default torrent client...')
      }

      this.defaultLoading = false
    }
  }
}
</script>

<style lang="stylus" scoped>
  .path
    font-size 18px
    letter-spacing 0.03em
    font-weight 300
</style>
