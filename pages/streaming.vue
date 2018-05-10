<template lang="pug">
  v-container#container(fluid)

    v-layout(row, wrap, align-content-start)
      v-flex.form(xs12)
        .term
          v-text-field(
            @keyup.enter='search',
            v-model='term',
            label='Looking for something to watch?'
          )

      v-flex(xs12, v-if='!$store.state.isConnected') You are offline :(
      v-flex(xs12, v-else-if='term && isSearching') Loading...
      v-flex(xs12, v-else-if='!animes.length && !term') What are you doing? Watch something!
      v-flex(xs12, v-else-if='!animes.length && term && !isSearching') No result.

      v-flex(
        v-for='anime in visibleAnimes',
        :key='anime',
        xs12, sm6, md4, xl3
      ) {{ anime }}

    v-fade-transition
      .pagination-container(v-if='pageLength > 1')
        v-pagination(
          v-model='pageIndex',
          :length='pageLength',
          total-visible='7'
        )
</template>

<script>
  import _ from 'lodash'
  import { mapGetters } from 'vuex'

  export default {
    data: () => ({
      isSearching: false,
      pageIndex: 1
    }),

    computed: {
      ...mapGetters('streaming', [
        'files'
      ]),
      term: {
        set (val) {
          this.$store.commit('streaming/setTerm', val)
        },
        get () {
          return this.$store.state.streaming.page.term
        }
      },
      animes () {
        return Object.keys(this.files)
      },
      pageLength () {
        return Math.ceil(this.animes.length / 6)
      },
      fileRange () {
        const index = this.pageIndex - 1

        return {
          inf: index * 6,
          sup: (index + 1) * 6 - 1
        }
      },
      visibleAnimes () {
        return this.animes.slice(this.fileRange.inf, this.fileRange.sup + 1)
      }
    },

    methods: {
      async search () {
        if (!this.isSearching) {
          if (!this.$store.state.isConnected) return

          this.isSearching = true

          await this.$store.dispatch('streaming/watch', {
            name: this.term
          })

          this.isSearching = false
        }
      }
    },

    watch: {
      term: _.debounce(async function () {
        this.term.length > 2 && await this.search()
      }, 1000)
    }
  }
</script>

<style lang="stylus" scoped>
  #container
    height 100%
    min-height calc(100vh - 48px - 24px)
    position relative

  .layout
    height 100%

  .form
    text-align center
    height 80px

  .term
    display inline-block
    width 33%
    height 10%

  .layout > .flex
    display flex
    justify-content center

  .pagination-container
    width 100%
    position absolute
    text-align center
    bottom 5px
</style>
