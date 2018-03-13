<template lang="pug">
	v-dialog(v-model='values.show', lazy, absolute, width='initial' @keydown.esc='close()')
		video(v-if="values.show" controls :src='values.link && `/stream/${values.link.link}`')
</template>

<script>

export default {
  mounted () {
    console.log('Mounted', this.values.link.link)
  },
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
      this.$store.commit('videoPlayer/close')
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
