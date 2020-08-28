<template lang="pug">
  .controls-container
    .wide.actions-container.px-4
      v-container.pa-0(fluid, fill-height)
        v-row(justify='space-around', align='center')
          volume(
            @mute='toggleMute',
            @volume='changeVolume'
          )

          actions(
            @timeForward='timeForward',
            @togglePlay='togglePlay'
          )

          v-col.d-flex.justify-space-around(cols='4')
            subtitles(
              v-show='subtitles.has',
              :subtitles='subtitles',
              @updateTrack='updateTrack'
            )

            audios(
              v-show='audios.has',
              :audios='audios',
              @updateTrack='updateTrack'
            )

            fullscreen(
              @toggleFullScreen='toggleFullScreen'
            )

    .wide.progress-bar-container
      .d-flex.align-center.jusitfy-space-around.px-4
        progress-bar.ma-0.mr-1(
          dark,
          hide-details,
          color='secondary accent-2',
          :step='0',
          :value="$store.getters['streaming/controls'].timeline"
          @input='changeTimeline'
        )

        timestamp
</template>

<script>
import Volume from './volume.vue'
import Actions from './actions.vue'
import Subtitles from './subtitles.vue'
import Audios from './audio.vue'
import Fullscreen from './fullscreen.vue'
import ProgressBar from './progressBar.vue'
import Timestamp from './timestamp.vue'

export default {
  name: 'Controls',

  components: {
    Volume,
    Actions,
    Subtitles,
    Audios,
    Fullscreen,
    ProgressBar,
    Timestamp
  },

  props: {
    subtitles: Object,
    audios: Object
  },

  methods: {
    toggleFullScreen () {
      this.$emit('toggleFullScreen')
    },
    togglePlay () {
      this.$emit('togglePlay')
    },
    toggleMute () {
      this.$emit('mute')
    },
    changeVolume (value) {
      this.$emit('volume', value)
    },
    timeForward (value) {
      this.$emit('timeForward', value)
    },
    updateTrack (track) {
      this.$emit('updateTrack', track)
    },
    changeTimeline (value) {
      this.$emit('changeTimeline', value)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .controls-container
    position absolute
    top 65%
    left 50%
    width 450px
    height 80px
    transform translateX(-50%)
    background-color rgba(60, 60, 60, 0.8)
    border-radius 5px
    padding 0

    .wide
      width 100%

    .progress-bar-container
      height 40%

    .actions-container
      height 60%

</style>
