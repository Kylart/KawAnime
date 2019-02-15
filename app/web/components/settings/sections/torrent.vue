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
</template>

<script>
// Mixins
import Update from 'mixins/config/update.js'

export default {
  name: 'Torrent-Section',

  mixins: [ Update ],

  computed: {
    path: {
      get () {
        return this.config.localPath
      },
      set (val) {
        this.setDeepValue('torrentClient.defaultPath', val)
      }
    }
  },

  methods: {
    async openDialog () {
      const { data: { path } } = await this.$axios.get('openThis', {
        params: { type: 'dialog' }
      })

      if (path) this.path = path
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
