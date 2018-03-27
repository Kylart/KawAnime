<template lang="pug">
  v-dialog#video-player-dialog(
    v-model='show',
    persistent,
    lazy,
    width='initial',
    max-width='100%',
    @keydown.esc='close()',
    @keydown.right='forward(5)',
    @keydown.left='forward(-5)',
    @keydown.up='increaseVolume(5)',
    @keydown.down='increaseVolume(-5)',
    @keydown.space='togglePlay()',
    :fullscreen='fullscreen'
  )
    template(v-if='values.show')
      video-player(ref='player', :value='values.link.link', :title='values.link.name')
</template>

<script>

export default {
  data () {
    return {
      fullscreen: false
    }
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
    },
    async toggleFullScreen () {
      this.fullscreen = !this.fullscreen
      await this.$axios.get('/_fullScreen')
    },
    forward (value) {
      this.$refs.player.timeForward(value)
    },
    increaseVolume (value) {
      this.$refs.player.increaseVolume(value)
    },
    togglePlay () {
      this.$refs.player.togglePlay()
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
