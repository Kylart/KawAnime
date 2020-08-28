<template lang="pug">
  .window-buttons
    v-btn.video-size(
      color='secondary',
      dark,
      icon,
      outlined,
      @click.stop='act("minimize")',
      v-show='!fullscreen'
    )
      v-icon {{ isMinimized ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}

    v-btn.video-close.mr-2.ml-4(
      color='secondary',
      dark,
      icon,
      outlined,
      @click.stop='act("close")'
    )
      v-icon close
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'VideoActions',

  computed: {
    ...mapState('streaming', ['player']),

    fullscreen () {
      return this.player.controls.fullscreen
    },
    isMinimized () {
      return this.player.controls.isMinimized
    }
  },

  methods: {
    act (action) {
      this.$emit('actOnWindow', action)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .window-buttons
    position absolute
    right 5px
    top 1%

    .video-close, .video-size
      cursor pointer
</style>
