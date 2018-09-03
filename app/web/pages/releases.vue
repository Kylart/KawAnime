<template lang="pug">
  v-container(
    grid-list-md, fluid
  )
    v-layout(v-if='entries.length', row, wrap, justify-center)
      v-flex(
        xs3,
        v-for='entry in entries',
        :key='entry.links.magnet'
      )
        card(:info='entry.parsedName', :ref='entry.parsedName.title')

      v-pagination(
        xs12,
        v-model='page'
        :length='6'
      )

    v-layout(v-else, row, wrap)
      v-flex(xs12) Loading ?
</template>

<script>
// Components
import Card from 'components/feed/card.vue'

export default {
  name: 'Feed',

  components: { Card },

  data: () => ({
    page: 1,
    entryPerPage: 12,
    current: null
  }),

  computed: {
    releases: {
      get () {
        return this.$store.state.releases.releases
      },
      set () {}
    },
    info: {
      get () {
        return this.$store.state.info.info
      },
      set () {}
    },
    fileRange () {
      const index = this.page - 1

      return {
        inf: index * this.entryPerPage,
        sup: (index + 1) * this.entryPerPage - 1
      }
    },
    entries () {
      return this.releases.slice(this.fileRange.inf, this.fileRange.sup + 1)
    }
  },

  methods: {

  }
}
</script>

<style lang="stylus" scoped>

</style>
