<template lang="pug">
  v-container(fluid, fill-height, grid-list-xs)
    v-layout(row, wrap, justify-center)
      v-flex.term(xs5)
        v-text-field(
          @keyup.enter='search',
          v-model='term',
          label='Looking for something?'
        )

      v-flex(xs12) Blabla
</template>

<script>
  import _ from 'lodash'

  export default {
    data: () => ({
      isSearching: false
    }),

    computed: {
      torrents: {
        set () {},
        get () {
          return this.$store.state.streaming.page.torrents
        }
      },
      term: {
        set (val) {
          this.$store.commit('streaming/setTerm', val)
        },
        get () {
          return this.$store.state.streaming.page.term
        }
      }
    },

    methods: {
      async search () {
        if (!this.isSearching) {
          this.isSearching = true

          // async search

          this.isSearching = false
        }
      }
    },

    watch: {
      term: _.debounce(async () => {
        await this.search()
      }, 300)
    }
  }
</script>

<style lang="stylus" scoped>

</style>
