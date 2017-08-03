<template lang="pug">
  v-container(fluid).pa-0
    loader(v-if="!$store.state.news.length")

    v-container(fluid v-else)
      v-layout(row wrap).news-container
        v-flex(xs12).refresh-button-container
          v-btn(icon @click="refresh()").refresh-button
            v-icon(large) refresh
        virtual-list(:size="220", :remain="4").list-container
          news(v-for="item in $store.state.news", :item="item", :key="item.title")
</template>

<script>
  export default {
    methods: {
      refresh () {
        this.$store.dispatch('refreshNews')
      }
    }
  }
</script>

<style scoped>
  /* ----- Refresh button ----- */
  .refresh-button-container
  {
    display: inline-block;
    text-align: right;
    margin-top: 5px;
    margin-bottom: 2px;
    padding-right: 3%;
  }

  .refresh-button
  {
    display: inline-block;
  }

  /* ---------- ELEM ---------- */
  .news-container
  {
    padding: 0 0 1% 1%;
  }

  .list-container
  {
    padding-right: 10px;
  }
</style>
