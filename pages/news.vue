<template lang="pug">
  div
    v-container(fluid v-if='!news.length')
      loader

    v-container(fluid v-else)
      v-layout(row wrap).news-container
        v-flex(xs12).refresh-button-container
          v-btn(icon @click="refresh()").refresh-button
            v-icon(large) refresh
        v-flex(xs12).pr-3
          news(v-for="item in news", :item="item", :key="item.title")
</template>

<script>
  export default {
    methods: {
      refresh () {
        this.$store.dispatch('news/refresh')
      }
    },
    computed: {
      news () {
        return this.$store.state.news.data
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
