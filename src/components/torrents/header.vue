<template lang="pug">
  v-flex(xs12)
    v-layout(justify-end)
      v-btn(@click='showDialog') Add Torrent
</template>

<script>
export default {
  name: 'Torrent-Header',

  methods: {
    showDialog () {
      this.$store.commit('torrents/showDialog', true)
    }
  }
}
</script>
