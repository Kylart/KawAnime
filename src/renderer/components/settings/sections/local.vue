<template lang="pug">
  //- We need directory and inside choice.
  v-card.elevation-12
    v-card-title.section-title Local files configuration
    v-divider
    v-card-text
      v-container(grid-list-lg, pa-0)
        v-layout(row, wrap, justify-center, align-center)
          v-flex(xs12, sm4, md2)
            v-btn(text, @click='openDialog') Change Dir
          v-flex(xs12, sm8, md6)
            .path.ellipsis.pl-2 {{ path }}
          v-flex(xs12, md4, d-flex, align-center, justify-space-around)
            v-switch.mt-0(
              v-model='inside',
              color='primary',
              :label="inside ? 'Inside' : 'Outside'"
              persistent-hint,
              hint='Play in KawAnime?'
            )

            v-switch.mt-0(
              v-model='recursiveSearch',
              color='primary',
              :label="recursiveSearch ? 'Recursive' : 'Folder only'"
              persistent-hint,
              hint='Search for files recursively?'
            )
</template>

<script>
// Mixins
import Update from '@/mixins/config/update.js'

export default {
  name: 'Local-Section',

  mixins: [ Update ],

  computed: {
    inside: {
      get () {
        return this.config.inside
      },
      set (val) {
        this.setValue('inside', val)
        this.$store.commit('localFiles/setInside', val)
      }
    },
    path: {
      get () {
        return this.config.localPath
      },
      set (val) {
        this.setValue('localPath', val)
        this.$store.commit('localFiles/setDir', val)
      }
    },
    recursiveSearch: {
      get () {
        return this.config.recursiveSearch
      },
      set (val) {
        this.setValue('recursiveSearch', val)
        this.$store.commit('localFiles/setRecursiveSearch', val)

        this.$store.dispatch('localFiles/update')
      }
    }
  },

  methods: {
    async openDialog () {
      const path = await this.$openDialog()

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
