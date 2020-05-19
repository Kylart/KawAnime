<template lang="pug">
  v-row.px-4(justify='end')
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
