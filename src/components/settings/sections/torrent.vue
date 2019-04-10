<template lang="pug">
  //- We need directory and inside choice.
  v-card.elevation-12
    v-card-title.section-title Torrent client configuration
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
</template>

<script>
// Comes from https://github.com/electron/electron/issues/14108
import { Registry } from 'rage-edit'

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
    async openDialog () {
      const path = await this.$openDialog()

      if (path) this.path = path
    },
    async setDefault () {
      this.$log('Registering as default torrent app...')
      this.defaultLoading = true

      let isOk = false

      if (process.platform === 'win32') {
        isOk = await this.installWindows()
      } else {
        const { app } = this.$electron.remote

        isOk = this.protocols
          .map((protocol) => app.setAsDefaultProtocolClient(protocol))
          .every(Boolean)
      }

      if (isOk) {
        this.$log('Success!')
        this.isDefault = true
      } else {
        this.$log('Failure.')
        this.$store.commit('setInfoSnackbar', 'Could not register as default torrent client...')
      }

      this.defaultLoading = false
    },
    async installWindows () {
      const appName = 'KawAnime'

      try {
        await Promise.all(
          this.protocols.map(async (protocol) => {
            await Registry.set(`HKCU\\Software\\${appName}\\Capabilities`, 'ApplicationName', `${appName}`)
            await Registry.set(`HKCU\\Software\\${appName}\\Capabilities`, 'ApplicationDescription', `${appName}`)
            await Registry.set(`HKCU\\Software\\${appName}\\Capabilities\\URLAssociations`, `${protocol}`, `${appName}.${protocol}`)
            await Registry.set(`HKCU\\Software\\Classes\\${appName}.${protocol}\\DefaultIcon`, ``, process.execPath)
            await Registry.set(`HKCU\\Software\\Classes\\${appName}.${protocol}\\shell\\open\\command`, ``, `"${process.execPath}" "%1"`)
            await Registry.set(`HKCU\\Software\\RegisteredApplications`, `${appName}`, `Software\\${appName}\\Capabilities`)
          })
        )

        return true
      } catch (e) {
        this.$log('Could not register the app as default client.', e)
        return false
      }
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
