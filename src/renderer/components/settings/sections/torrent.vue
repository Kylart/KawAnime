<template lang="pug">
  div
    v-card.elevation-12.mb-3
      v-card-title.section-title Torrent client configuration

    v-card.elevation-12.mb-3
      v-card-title.section-title Download settings
      v-divider
      v-card-text
        v-row.pa-0
          v-row(justify='center', align='center')
            v-col(cols='12', sm='4', md='2')
              v-btn(text, @click='openDialog') Change Dir
            v-col(cols='12', sm='8', md='8')
              .path.ellipsis.pl-2 {{ path }}
            v-col(cols='12', sm='6', md='4')
              v-btn(:disabled='isDefault', :loading='defaultLoading', @click='setDefault') {{ defaultLabel }}

    v-card.elevation-12
      v-card-title.section-title Streaming settings

      v-divider

      v-card-text
        v-container.pa-0
          v-row(justify='space-around', align='center')
            v-btn(text, @click="openDialog('streaming')") Change Dir
            .path.ellipsis.pl-2 {{ streamingPath }}
            v-tooltip(top)
              template(v-slot:activator='{ on }')
                v-btn(icon, v-on='on', @click='openStreamingFolder')
                  v-icon open_in_new
              span Open
            v-tooltip(top)
              template(v-slot:activator='{ on }')
                v-btn(icon, v-on='on', @click='resetToTmp')
                  v-icon(large) refresh
              span Reset to temporary folder

      v-card-actions
        v-spacer
        div
          .conditions When streaming, the file is temporarely kept on your computer
          .conditions You can keep those if you choose another folder that the temporary one
</template>

<script>
// Mixins
import Update from '@/mixins/config/update.js'

export default {
  name: 'Torrent-Section',

  mixins: [Update],

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
