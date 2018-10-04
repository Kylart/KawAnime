<template lang="pug">
  div
    news-form

    transition-group(name='fade', mode='out-in')
      v-container(
        fluid, fill-height,
        v-if='isRefreshing', key='loading'
      )
        loader

      v-container(
        fluid, grid-list-md,
        v-else, key='news'
      )
        v-layout(row, wrap)
          template(v-for='entry in reduced')
            v-flex(xs12, md6, lg4, xl3)
              card(:info='entry')
</template>

<script>
import Card from 'components/news/card.vue'
import NewsForm from 'components/news/form.vue'
import Loader from 'components/news/loader.vue'

// Allows fancy lazy loading of entries
import Reduced from 'mixins/global/reduced.js'

export default {
  name: 'News',

  components: { Card, NewsForm, Loader },

  mixins: [ Reduced ],

  data: () => ({
    sup: 8,
    initSup: 8
  }),

  computed: {
    entries: {
      get () {
        return this.$store.state.news.data
      },
      set () {}
    },
    isRefreshing: {
      get () {
        return this.$store.state.news.refreshing
      },
      set () {}
    }
  }
}
</script>

<style lang="stylus" scoped>
  /* ----- Refresh button ----- */
  .refresh-button-container
    display inline-block
    text-align right
    margin-top 5px
    margin-bottom 2px
    padding-right 3%

  .refresh-button
    display inline-block

  /* ---------- ELEM ---------- */
  .news-container
    padding 0 0 1% 1%
</style>
