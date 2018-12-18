<template lang="pug">
  v-fade-transition.main-color--text.video-waiting(dark, indeterminate, v-show='waiting')
    .controls-container
      .controls
        //- Top title
        h6.video-title(v-show='show') {{ title }}

        //- Window buttons
        v-btn.video-close(color='indigo', dark, icon, @click.stop='actOnWindow("close")', v-show='show')
          v-icon close

        v-btn.video-size(color='indigo', dark, icon, @click.stop='actOnWindow("minimize")', v-show='show && !fullscreen')
          v-icon {{ isMinimized ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}

        //- Center play button
        v-icon.video-play(dark, @click.stop='togglePlay', v-if='paused') play_arrow

        //- Loading object
        v-progress-circular

        .bottom-container(v-show='show')

          progress-bar.timeline(
            dark, hide-details, color='indigo',
            :step='0', :buffer='buffered', :value='timeline',
            :duration='duration',
            @input='changeTimeline'
          )

          v-btn(color='indigo', dark, icon, @click.stop='togglePlay')
            v-icon(v-html="paused ? 'play_arrow' : 'pause'")
          v-btn(color='indigo', dark, icon, @click.stop='toggleMute')
            v-icon(v-html="muted ? 'volume_off' : 'volume_up'")
          v-slider.volume(hide-details, color='indigo', dark, :max='100', :value='muted ? 0 : volume', thumb-label, @input='changeVolume')
          div.timer {{ currentTime }}/{{ duration }}
          v-tooltip(top)
            span Rewind 5s
            v-btn(color='indigo', dark, icon, @click.stop='timeForward(-5)', slot='activator')
              v-icon replay_5
          v-tooltip(top)
            span Fast forward 5s
            v-btn(color='indigo', dark, icon, @click.stop='timeForward(5)', slot='activator')
              v-icon forward_5
          v-tooltip(top)
            span Skip 1m25 (op&ed)
            v-btn(color='indigo', dark, icon, @click.stop='timeForward(85)', slot='activator')
              v-icon fast_forward

          v-btn#fullscreen.right(color='indigo', dark, icon, @click.stop='toggleFullScreen')
            v-icon(v-html="fullscreen ? 'fullscreen_exit' : 'fullscreen'")
          v-menu.right(v-if='$refs.video && show', open-on-hover, offset-overflow, offset-y, top)
            v-btn.subtitles(slot='activator', color='indigo', dark)
              v-icon subtitles
            v-list
              v-list-tile.video-subtitle(v-for='(num, i) in Object.keys(numToLang)', :key='i' @click='setSubLanguage(num)')
                v-list-tile-title(:class="{ 'blue--text': +num === trackNumber }") {{ numToLang[num] }}
</template>

<script>
import ProgressBar from 'components/video/progressBar.vue'

export default {
  name: 'Player-Controls',

  components: {
    ProgressBar
  },

  props: [
    'video',
    'title',
    'waiting',
    'paused',
    'fullscreen'
  ],

  data: () => ({
    show: true,
    muted: false,
    timeline: 0,
    currentTime: 0,
    duration: 0,
    volume: 100,
    buffered: [],
    timeoutID: null,
    isMinimized: false
  }),

  methods: {
    reveal () {
      this.show = true

      // if (this.timeoutID) clearTimeout(this.timeoutID)
      // this.timeoutID = setTimeout(this.hide, 3000)
    },
    hide () {
      this.show = false
    },

    updateTime () {
      const { video } = this

      if (video) {
        this.currentTime = this.formatTime(video.currentTime)
        this.timeline = 100 / video.duration * video.currentTime
        this.duration = this.formatTime(video.duration)
      }
    },
    updateBuffer () {
      const { video } = this

      if (video) {
        const buffered = []

        for (let i = 0, l = video.buffered.length; i < l; ++i) {
          buffered.push([
            video.buffered.start(i) / video.duration * 100,
            video.buffered.end(i) / video.duration * 100
          ])
        }

        this.buffered = buffered
      }
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
      this.muted = this.video.muted = !this.muted
    },
    actOnWindow (action) {
      this.$emit('actOnWindow', action)

      if (action === 'minimize') this.isMinimized = !this.isMinimized
    },
    changeTimeline (value) {
      const { video } = this
      if (video) { video.currentTime = video.duration * ((this.timeline = value) / 100).toFixed(10) }
    },
    timeForward (value) {
      const { video } = this

      if (video) {
        video.currentTime += value
      }
    },
    changeVolume (value) {
      if (this.video) this.video.volume = (this.volume = value) / 100
    },
    increaseVolume (value) {
      const { video } = this.$refs

      if (video) {
        const currentVolume = video.volume * 100
        let newVolume = currentVolume + value

        newVolume = newVolume >= 0 && newVolume <= 100
          ? newVolume
          : currentVolume

        this.volume = newVolume
        this.video.volume = newVolume / 100
      }
    },
    setTrack (track) {
      this.$emit('trackChange', track)
    }
  }
}
</script>

<style lang="stylus">
  .controls-container
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    z-index 2
    pointer-events none

    .controls
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

    .video-close
      cursor pointer
      pointer-events all
      position absolute
      right 5px
      top 1%

    .video-size
      cursor pointer
      pointer-events all
      position absolute
      right 50px
      top 1%

    .video-waiting
      position absolute
      left 50%
      top 50%
      height 10% !important
      width 10% !important
      transform translate(-50%, -50%)

    .video-play
      cursor pointer
      pointer-events all
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      height 100px
      width 100px
      font-size 100px

    .bottom-container
      background linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.07), rgba(0, 0, 0, 0.0))
      text-align left
      position absolute
      width 100%
      bottom 0
      pointer-events all

      .timeline
        padding 10px !important
        margin-bottom 10px
        height 10px

      .volume
        vertical-align middle
        display inline-block
        width 100px
        padding 0

      .timer
        margin-left 15px
        vertical-align middle
        display inline-block
        width 100px
        padding 0
        color white !important

      .subtitles
        min-width 0
        width 40px

  @media (max-width: 600px)
    .bottom-container
      .volume
        display none !important
</style>
