<template lang="pug">
  v-flex(xs12)
    v-layout(justify-space-between, align-center)
      div
        div(v-show='client')
      v-btn(@click='showDialog') Add Torrent
</template>

<script>
export default {
  name: 'Torrent-Header',

  props: ['client'],

  computed: {
    config () {
      return this.$store.state.config.config.torrents
    }
  },

  methods: {
    showDialog () {
      this.$store.commit('torrents/showDialog', true)
    }
  }
}
</script>
