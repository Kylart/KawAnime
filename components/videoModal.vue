<template lang="pug">
  v-dialog(v-model='values.show', lazy, absolute, width='initial' @keydown.esc='close()')
    template(v-if='values.show')
      video-player(:value='values.link.link')
      h2.text-md-center {{ values.link.name }}
</template>

<script>

export default {
  computed: {
    values () {
      return this.$store.state.videoPlayer.player
    },
    show () {
      return this.values.show
    }
  },
  methods: {
    close () {
      if (document.fullscreenElement === null) {
        this.$store.commit('videoPlayer/close')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
