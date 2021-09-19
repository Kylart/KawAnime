<template lang="pug">
  v-container
    v-row(justify='end')
      v-col(cols='10', sm='5', md='3', xl='1')
        v-select(
          label='Data source',
          v-model='feed',
          :items='feeds',
          item-text='text',
          item-value='value',
          persistent-hint,
          hint='Where should we get that news from?'
        )

      .refresh
        v-btn(
          :loading='isRefreshing'
          icon, large,
          @click='refresh'
        )
          v-icon(large) refresh
</template>

<script>
export default {
  name: 'News-Form',

  data: () => ({
    feeds: [{
      text: 'MyAnimeList.net',
      value: 'mal'
    }]
  }),

  computed: {
    feed: {
      get () {
        return this.$store.state.news.feed
      },
      set (val) {
        this.$store.commit('news/setFeed', val)
      }
    },
    isRefreshing: {
      get () {
        return this.$store.state.news.refreshing
      },
      set () {}
    }
  },

  methods: {
    refresh () {
      this.$store.dispatch('news/refresh')
    }
  }
}
</script>

<style lang="stylus">
  .refresh
    display flex
    align-items center
</style>
