<template lang="pug">
  div
    transition-group(name='fade', mode='out-in')
      InfoDisplayer(
        v-if='current', key='info',
        :current='current', :return-cb='resetCurrent'
      )

      v-container(v-else, fluid, grid-list-lg, pt-1, key='tools')
        tools(:nb-elems='files.length', :resetting='resetting', @reset='reset', ref='tools')

        transition(name='list')
          empty(v-if='!files.length', key='empty')

        transition-group(
          v-if='files.length',
          key='files', name='list',
          class='trans layout row wrap justify-space-around', tag='div'
        )
          template(v-for='file in files')
            v-flex(xs12, sm6, md3, lg3, xl2, :key='`${file.title} - ${file.episodeOrMovieNumber || ""}`')
              card(:reset='resetting', :file='file', @more='setCurrent', @refresh='refresh', @reset='handleChildReset')
</template>

<script>
import Tools from 'components/local/tools.vue'
import Card from 'components/local/card.vue'
import Empty from 'components/local/empty.vue'

import InfoDisplayer from 'components/info/layout.vue'

export default {
  name: 'Local',

  components: { Tools, Card, Empty, InfoDisplayer },

  data: () => ({
    current: null,
    resetting: false,
    resetIndex: 0
  }),

  computed: {
    files: {
      get () {
        return this.$store.state.localFiles.files
      },
      set () {}
    }
  },

  methods: {
    setCurrent (info, file) {
      const key = `local/${file.title}`

      this.$store.commit('info/add', {
        key,
        value: info
      })

      this.current = {
        title: key,
        releaseGroup: file.releaseGroup
      }
    },
    resetCurrent () {
      this.current = null
    },
    refresh () {
      this.$refs.tools.refresh()
    },
    sanitize (value) {
      return value.replace(':', '')
    },
    reset () {
      this.resetting = true
    },
    handleChildReset () {
      this.resetIndex++

      if (this.resetIndex === this.files.length) {
        this.resetIndex = 0
        this.resetting = false
        this.$log('Done.')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .trans
    width 100%
</style>
