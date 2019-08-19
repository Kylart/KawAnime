<template lang="pug">
  .controls-container
    v-container(grid-list-xs, fill-height, pa-0)
      v-layout(column, row, wrap, align-center, justify-center)
        v-flex.wide.actions-container.pt-2(xs7, d-flex, align-center)
          v-container(pa-0, grid-list-xs)
            v-layout(row, wrap, justify-space-between, align-center)
              v-flex(xs3, d-flex, justify-center, align-center)
                v-icon(@click='toggleMute', v-html="muted ? 'volume_off' : 'volume_up'")
                v-slider.volume.ma-0.ml-1(
                  thumb-label,
                  hide-details, dark,
                  color='indigo accent-2',
                  max='100',
                  :value='muted ? 0 : volume',
                  @input='changeVolume',
                )

              v-flex(xs4, justify-space-around, align-center, d-flex)
                v-tooltip(top)
                  span Rewind 5s
                  template(v-slot:activator='{ on }')
                    v-icon(@click='timeForward(-5)', v-on='on') replay_5
                v-icon(large, @click='togglePlay', v-html='paused ? "play_arrow" : "pause"')
                v-tooltip(top)
                  span Fast forward 5s
                  template(v-slot:activator='{ on }')
                    v-icon(@click='timeForward(5)', v-on='on') forward_5
                v-tooltip(top)
                  span Skip 1m25 (op & ed)
                  template(v-slot:activator='{ on }')
                    v-icon(@click='timeForward(85)', v-on='on') fast_forward

              v-flex(xs2)
                v-menu(v-show='hasTracks', offset-overflow, offset-y, top)
                  template(v-slot:activator='{ on }')
                    v-btn.subtitles.ma-0(v-on='on', small, outlined, icon, color='indigo accent-2')
                      v-icon(small) subtitles
                  v-list(dense).subtitle-lang
                    v-list-item(v-for='(num, i) in Object.keys(numToLang)', :key='i' @click="setTrack(num)")
                      v-list-item-title(:class="{ 'blue--text': numToLang[num] === currentLang }") {{ numToLang[num] }}
                v-btn.fullscreen.ma-0.ml-2(color='indigo accent-2', small, outlined, icon, @click='toggleFullScreen')
                  v-icon(v-html="fullscreen ? 'fullscreen_exit' : 'fullscreen'")

        v-flex.wide.progress-bar-container(xs5, d-flex, align-center)
          v-container(pa-0, grid-list-xs)
            v-layout(row, wrap, justify-center, align-center)
              v-flex(xs9)
                progress-bar.ma-0(
                  dark, hide-details, color='indigo accent-2',
                  :step='0', :buffer='buffered', :value='timeline',
                  :duration='duration',
                  @input='changeTimeline'
                )
              v-flex(xs3, justify-center)
                .timer {{ currentTime }} / {{ duration }}
</template>

<script>
import ProgressBar from '@/components/video/progressBar.vue'

export default {
  name: 'Player-Controls',

  components: { ProgressBar },

  props: [
    'muted',
    'timeline',
    'currentTime',
    'duration',
    'volume',
    'buffered',
    'hasTracks',
    'numToLang',
    'currentLang',
    'paused',
    'fullscreen',
    'video'
  ],

  methods: {
    timeForward (value) {
      const { video } = this

      if (video) {
        video.currentTime += value
      }
    },
    // Because I'm lazy
    changeTimeline (value) {
      value && this.$parent.changeTimeline(value)
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
    pointer-events all
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
      padding 0 12px 4px 20px !important

    .actions-container
      padding 0 12px !important

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
