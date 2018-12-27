<template lang="pug">
  v-fade-transition
    .layout-container(v-show='show')
      //- Top title
      h6.video-title {{ title }}

      //- Window buttons
      v-btn.video-close(color='indigo', dark, icon, @click.stop='actOnWindow("close")')
        v-icon close

      v-btn.video-size(color='indigo', dark, icon, @click.stop='actOnWindow("minimize")', v-show='show && !fullscreen')
        v-icon {{ isMinimized ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}

      //- Center play button
      v-icon.video-play(dark, @click.stop='togglePlay', v-if='paused') play_arrow

      //- Loading object
      v-progress-circular.video-waiting(dark, indeterminate, v-show='waiting')

      player-controls(
        v-bind='controls',
        :paused='paused',
        :fullscreen='fullscreen'
      )
</template>

<script>
import PlayerControls from 'components/video/controls.vue'

export default {
  name: 'Player-Layout',

  components: {
    PlayerControls
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
    timeoutID: null,
    isMinimized: false,

    // Controls
    muted: false,
    timeline: 0,
    currentTime: 0,
    duration: 0,
    volume: 100,
    buffered: [],
    hasTracks: false,
    numToLang: {},
    currentLang: null
  }),

  computed: {
    controls () {
      return {
        muted: this.muted,
        timeline: this.timeline,
        currentTime: this.currentTime,
        duration: this.duration,
        volume: this.volume,
        buffered: this.buffered,

        hasTracks: this.hasTracks,
        numToLang: this.numToLang,
        currentLang: this.currentLang,

        video: this.video
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

    updateSubtitlesData () {
      this.hasTracks = Object.keys(this.$parent.tracks).length
      this.numToLang = this.$parent.numToLang
      this.currentLang = this.$parent.currentLang
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
      const { video } = this

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
      this.updateSubtitlesData()
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
    z-index 2
    pointer-events none

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
</style>
