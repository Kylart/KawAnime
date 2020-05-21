<template lang="pug">
  .controls-container
    .wide.actions-container.px-4
      v-container.pa-0(fluid, fill-height)
        v-row(justify='space-around', align='center')

          v-col(cols='4').sound
            v-icon(@click='toggleMute', v-html="mute ? 'volume_off' : 'volume_up'")
            v-slider.volume.ma-0.ml-1(
              thumb-label,
              hide-details, dark,
              color='secondary accent-2',
              max='100',
              :value='mute ? 0 : volume',
              @input='changeVolume',
            )

          v-col(cols='5').actions.text-center
            v-tooltip(top)
              span Rewind 5s
              template(v-slot:activator='{ on }')
                v-icon(@click='timeForward(-5)', v-on='on') replay_5
            v-icon(large, @click='togglePlay', v-html='pause ? "play_arrow" : "pause"')
            v-tooltip(top)
              span Fast forward 5s
              template(v-slot:activator='{ on }')
                v-icon(@click='timeForward(5)', v-on='on') forward_5
            v-tooltip(top)
              span Skip 1m25 (op & ed)
              template(v-slot:activator='{ on }')
                v-icon(@click='timeForward(85)', v-on='on') fast_forward

          v-col(cols='3').options.text-right
            v-menu(v-show='hasSubs', offset-overflow, offset-y, top)
              template(v-slot:activator='{ on }')
                v-btn.subtitles.ma-0(v-on='on', small, outlined, icon, color='secondary accent-2')
                  v-icon(small) subtitles
              v-list(dense).subtitle-lang
                v-list-item(v-for='(num, i) in Object.keys(numToLang)', :key='i' @click="setTrack(num)")
                  v-list-item-title(:class="{ 'blue--text': numToLang[num] === currentLang }") {{ numToLang[num] }}
            v-btn.fullscreen.ma-0.ml-2(color='secondary accent-2', small, outlined, icon, @click='toggleFullScreen')
              v-icon(v-html="fullscreen ? 'fullscreen_exit' : 'fullscreen'")

    .wide.progress-bar-container
      .d-flex.align-center.jusitfy-space-around.px-4
        progress-bar.ma-0.mr-1(
          dark,
          hide-details,
          color='secondary accent-2',
          :step='0',
          :buffer='buffered',
          :value='timeline',
          :duration='duration',
          @input='changeTimeline'
        )

        .timer {{ currentTime }} / {{ duration }}
</template>

<script>
import ProgressBar from '@/components/video/progressBar.vue'

export default {
  name: 'Player-Controls',

  components: { ProgressBar },

  props: [
    'timeline',
    'currentTime',
    'duration',
    'volume',
    'buffered',
    'hasSubs',
    'numToLang',
    'currentLang',
    'pause',
    'mute'
  ],

  computed: {
    controls: {
      get () {
        return this.$store.state.streaming.player.controls
      },
      set () {}
    },
    fullscreen () {
      return this.controls.fullscreen
    },
    isMinimized () {
      return this.controls.isMinimized
    },

    videoTitle () {
      return this.$store.state.streaming.player.name
    }
  },

  methods: {
    // Because I'm lazy
    timeForward (value) {
      this.$parent.timeForward(value)
    },
    changeTimeline (value) {
      value && this.$parent.seek(value)
    },
    changeVolume (value) {
      this.$parent.changeVolume(value)
    },
    togglePlay () {
      this.$parent.togglePlay()
    },
    toggleFullScreen () {
      this.$parent.toggleFullScreen()
    },
    toggleMute () {
      this.$parent.toggleMute()
    },
    setTrack (num) {
      this.$parent.setTrack(num)
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

    .timer
      padding 0 4px
      font-size 14px
      line-height 15px
      letter-spacing 0.04em
      font-weight 300
      text-align center

    .volume
      vertical-align middle
      display inline-block
      width 70%
      padding 0

    .subtitles
      min-width 0
      width 30px
</style>
