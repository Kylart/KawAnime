<template lang="pug">
  div.video-player(@mousemove='onMouseMove', :style='{ cursor: controlsHidden ? "none" : null }')
    video(ref='video',
      @pause='paused = true',
      @play='paused = false',
      @timeupdate='onTimelineChangeEvent',
      @waiting='waiting = true',
      @canplay='waiting = false',
      @progress='onProgress',
      @click='togglePlay',
      :src='`/stream/${value}`') Your browser does not support HTML5 video.

    v-progress-circular.main-color--text.video-waiting(dark, indeterminate, v-show='waiting')

    v-icon.video-play(dark, @click="togglePlay", v-if="paused") play_arrow

    v-fade-transition
      div.video-controls(v-show="hasPlayed && !controlsHidden")
        player-slider.timeline(dark, hide-details, color='blue', :step="0", :buffer="buffered", :value="timeline", @input="changeTimeline")
        v-btn(color="blue", dark, icon, @click.stop='togglePlay')
          v-icon(v-html='paused ? "play_arrow" : "pause"')
        v-btn(color="blue", dark, icon, @click.stop="toggleMute")
          v-icon(v-html="muted ? 'volume_off' : 'volume_up'")
        v-slider.volume(hide-details, color='blue', dark, :max="100", :value="muted ? 0 : volume", @input="changeVolume")
        div.timer {{ currentTime }}/{{ duration }}
        v-btn.right(color='blue', dark, icon, @click.stop="toggleFullScreen")
          v-icon(v-html="fullscreen ? 'fullscreen_exit' : 'fullscreen'")
        v-menu.right(v-if='$refs.video && !controlsHidden', open-on-hover, offset-overflow, offset-y, top)
          v-btn.subtitles(slot='activator', color='blue', dark)
            v-icon subtitles
          v-list
            v-list-tile.video-subtitle(v-for="(track,i) in $refs.video.textTracks", :key="i" @click="setTrack(track)")
              v-list-tile-title(:class="{ 'blue--text': track.mode === 'showing' }") {{ track.label }}
</template>

<script>

if (typeof document !== 'undefined') {
  import('fullscreen-api-polyfill')
}

export default {
  name: 'video-player',
  props: ['value'],
  data () {
    return {
      waiting: false,
      paused: true,
      muted: false,
      fullscreen: false,
      buffered: [],
      timeline: 0,
      volume: 100,
      currentTime: 0,
      duration: 0,
      controlsHidden: true,
      hasPlayed: false
    }
  },
  mounted () {
    this.eventSource = new window.EventSource(`/tracks/${this.value}`)
    const textTracks = {}

    this.eventSource.addEventListener('tracks', ({ data }) => {
      const tracks = JSON.parse(data)
      tracks.forEach(track => {
        const language = (track.language || 'eng').slice(0, 2)
        textTracks[track.number] = this.$refs.video.addTextTrack('captions', language, language)
      })
    })

    this.eventSource.addEventListener('subtitle', ({ data }) => {
      const { trackNumber, subtitle: { time, duration, text } } = JSON.parse(data)
      if (trackNumber in textTracks) {
        textTracks[trackNumber].addCue(new window.VTTCue(time / 1000, (time + duration) / 1000, text.replace(/\\N/g, '\n')))
      }
    })
  },
  created () {
    document.addEventListener('fullscreenchange', this.onFullscreenEvent)
    document.addEventListener('fullscreenerror', this.onFullscreenEvent)
  },
  beforeDestroy () {
    this.eventSource && this.eventSource.close()
    document.removeEventListener('fullscreenchange', this.onFullscreenEvent)
    document.removeEventListener('fullscreenerror', this.onFullscreenEvent)
  },
  methods: {
    formatTime (time = 0) {
      let minutes = Math.floor(time / 60)
      minutes = minutes >= 10 ? minutes : '0' + minutes
      let seconds = Math.floor(time % 60)
      seconds = seconds >= 10 ? seconds : '0' + seconds
      return `${minutes}:${seconds}`
    },
    togglePlay () {
      const video = this.$refs.video
      this.showControls()
      this.paused ? video.play() : video.pause()
      this.hasPlayed = true
    },
    toggleMute () {
      this.muted = this.$refs.video.muted = !this.muted
    },
    toggleFullScreen () {
      this.fullscreen
        ? document.exitFullscreen()
        : this.$el.requestFullscreen()
    },
    onFullscreenEvent () {
      this.fullscreen = document.fullscreenElement !== null
    },
    onTimelineChangeEvent () {
      const video = this.$refs.video
      if (video) this.timeline = 100 / video.duration * video.currentTime
      this.currentTime = this.formatTime(video.currentTime)
      this.duration = this.formatTime(video.duration)
    },
    onProgress () {
      const video = this.$refs.video
      if (video) {
        const buffered = []
        for (let i = 0; i < video.buffered.length; ++i) {
          buffered.push([
            video.buffered.start(i) / video.duration * 100,
            video.buffered.end(i) / video.duration * 100
          ])
        }
        this.buffered = buffered
      }
    },
    changeTimeline (value) {
      const video = this.$refs.video
      if (video) { video.currentTime = video.duration * ((this.timeline = value) / 100) }
    },
    changeVolume (value) {
      if (this.$refs.video) { this.$refs.video.volume = (this.volume = value) / 100 }
    },
    onMouseMove (e) {
      if (Math.abs(e.movementX) > 1 || Math.abs(e.movementY) > 1) { this.showControls() }
    },
    showControls () {
      this.controlsHidden = false
      if (this.timeoutID) clearTimeout(this.timeoutID)
      this.timeoutID = setTimeout(() => (this.controlsHidden = true), 3000)
    },
    setTrack (track) {
      const video = this.$refs.video
      if (track.mode === 'showing') {
        track.mode = 'hidden'
      } else {
        for (const track of video.textTracks) {
          track.mode = 'hidden'
        }

        track.mode = 'showing'
      }
    }
  }
}
</script>

<style lang="stylus">
  .video-player
    background-color black
    line-height 0px
    position relative
    display inline-block
    height 100%
    width 100%

    &:fullscreen
      width 100vw

    video
      height 100%
      width 100%

    .video-waiting
      position absolute
      left 50%
      top 50%
      height 10% !important
      width 10% !important
      transform translate(-50%, -50%)

    .video-play
      cursor pointer
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      height 100px
      width 100px
      font-size 100px

    .video-controls
      text-align left
      position absolute
      width 100%
      bottom 0

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

  .video-subtitle > .list__tile
    padding 0 8px

  @media (max-width: 600px)
    .video-controls
      .volume
        display none !important
</style>
