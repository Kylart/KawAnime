<template lang="pug">
  v-fade-transition
    .layout-container(v-show='show')
      //- Top title
      h6.video-title {{ title }}

      //- Window buttons
      .window-buttons
        v-btn.video-size(color='secondary', dark, icon, outlined, @click.stop='actOnWindow("minimize")', v-show='!controls.fullscreen')
          v-icon {{ controls.isMinimized ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}

        v-btn.video-close.mr-2.ml-4(color='secondary', dark, icon, outlined, @click.stop='actOnWindow("close")')
          v-icon close

      //- Loading object
      //- v-progress-circular.video-waiting(dark, indeterminate, v-show='waiting')

      player-controls(
        v-bind='controls',
      )
</template>

<script>
import PlayerControls from '@/components/video/controls.vue'

export default {
  name: 'Player-Layout',

  components: {
    PlayerControls
  },

  props: [
    'title',
    'timeline',
    'duration',
    'hasSubs',
    'subs',
    'currentLang',
    // 'waiting',
    'pause'
  ],

  data: () => ({
    show: true,
    timeoutID: null,

    // Controls
    buffered: []
  }),

  computed: {
    controls () {
      return {
        ...this.$store.state.streaming.player.controls,
        timeline: this.timeline,
        currentTime: this.formatTime(this.timeline),
        duration: this.formatTime(this.duration),
        buffered: this.buffered,

        pause: this.pause,

        hasSubs: this.hasSubs,
        numToLang: this.subs,
        currentLang: this.currentLang
      }
    }
  },

  methods: {
    reveal () {
      this.show = true
      this.$emit('show')

      if (this.timeoutID) clearTimeout(this.timeoutID)
      this.timeoutID = setTimeout(this.hide, 3000)
    },
    hide () {
      this.show = false
      this.$emit('hide')
    },

    formatTime (time = 0) {
      const minutes = ('0' + Math.floor(time / 60)).slice(-2)
      const seconds = ('0' + Math.floor(time % 60)).slice(-2)

      return `${minutes}:${seconds}`
    },
    togglePlay () {
      this.$emit('togglePlay')
    },
    toggleFullScreen () {
      this.$emit('toggleFullScreen')
    },
    toggleMute () {
      this.$emit('mute')
    },
    actOnWindow (action) {
      this.$emit('actOnWindow', action)
    },
    timeForward (value) {
      this.$emit('timeForward', value)
    },
    changeVolume (value) {
      this.$emit('volume', value)
    },
    seek (value) {
      this.$emit('seek', value)
    },
    increaseVolume (value) {
      const currentVolume = this.controls.volume * 100
      let newVolume = currentVolume + value

      newVolume = newVolume >= 0 && newVolume <= 100
        ? newVolume
        : currentVolume

      this.volume = newVolume

      // this.video.volume = newVolume / 100
    },
    setTrack (track) {
      this.$emit('trackChange', track)
    }
  }
}
</script>

<style lang="stylus">
  .layout-container
    position absolute
    top 0
    left 0
    width 100%
    height 100%

    .video-title
      position absolute
      width 80%
      left 10%
      top 4%
      text-align center
      line-height 22px
      font-weight 700
      -webkit-text-stroke 1px black

    .window-buttons
      position absolute
      right 5px
      top 1%

      .video-close, .video-size
        cursor pointer

    .video-waiting
      position absolute
      left 50%
      top 50%
      height 10% !important
      width 10% !important
      transform translate(-50%, -50%)
</style>
