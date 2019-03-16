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
// Mixins
import Update from 'mixins/config/update.js'

export default {
  name: 'Torrent-Section',

  mixins: [ Update ],

  data: () => ({
    isDefault: false,
    defaultLoading: false
  }),

  async mounted () {
    this.isDefault = (await this.$axios.get('protocols/isDefault')).data
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
      const { data: { path } } = await this.$axios.get('openThis', {
        params: { type: 'dialog' }
      })

      if (path) this.path = path
    },
    async setDefault () {
      this.$log('Registering as default torrent app...')
      this.defaultLoading = true

      const { status } = await this.$axios.post('protocols/register')

      if (status === 200) {
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
