<template lang="pug">
  v-container(
    grid-list-lg, fluid
  )
    v-layout(row, wrap, justify-center)
      v-flex(
        xs3,
        v-for='entry in entries',
        :key='entry.links.magnet'
      )
        card(:info='entry', :ref='entry.parsedName.title')

      v-pagination(
        xs12,
        v-model='page'
        :length='6'
      )
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import Card from 'components/feed/card.vue'

export default {
  name: 'Entries',

  components: { Card },

  data: () => ({
    page: 1,
    entryPerPage: 12
  }),

  computed: {
    ...mapGetters('info', {
      allInfo: 'getInfo'
    }),
    releases: {
      get () {
        return this.$store.state.releases.releases
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
  }
}
</script>
