<template lang="pug">
  .video-player(
    @mousemove='onMouseMove',
    :style='{ cursor: !layoutShow ? "none" : null }'
  )
    video(
      ref='video',
      crossorigin='anonymous',
      name='kawanime-player',
      :autoplay='config.autoplay',
      @pause='paused = true',
      @play='paused = false',
      @timeupdate='onTimelineChangeEvent',
      @waiting='waiting = true',
      @canplay='onCanPlay',
      @progress='onProgress',
      @seeked='onSeeked',
      @ended='onEnded',
      @click='togglePlay',
      @dblclick='toggleFullScreen',
      :src='value'
    ) Your browser does not support HTML5 video.

    cues-container(
      v-show='isAss && trackNumber',
      ref='cuesContainer',
      :cues='currentTrack'
    )

    layout(
      ref='layout',
      :video='$refs.video',
      :title='videoTitle',
      :waiting='waiting',
      :paused='paused',
      :fullscreen='fullscreen',
      :isMinimized='isMinimized',
      @trackChange='setTrack',
      @togglePlay='togglePlay',
      @toggleFullScreen='toggleFullScreen',
      @actOnWindow='actOnWindow',
      @show='layoutShow = true',
      @hide='layoutShow = false'
    )
</template>

<script>
// Comps
import Layout from '@/components/video/layout.vue'
import CuesContainer from '@/components/video/cues/container.vue'

// Mixins and methods
import Tracks from '@/mixins/video/tracks'
import Subtitles from '@/mixins/video/subtitles'
import Style from '@/mixins/video/getStyle'
import Tracking from '@/mixins/video/tracking'

export default {
  name: 'video-player',

  components: {
    CuesContainer,
    Layout
  },

  mixins: [ Tracks, Subtitles, Style, Tracking ],

  props: ['value', 'title', 'fullscreen', 'isMinimized'],

  data () {
    return {
      waiting: false,
      paused: true,
      layoutShow: true,
      isMagnetRe: /^magnet:\?/,
      name: '',
      hasAppendedToHistory: false
    }
  },

  mounted () {
    const { video, layout } = this.$refs

    video.addEventListener('loadedmetadata', () => {
      // We need to get the subtitles only when the torrent is ready to be read.
      // Otherwise, there is no file to get the subtitles from.
      this.setHeight()
      layout.reveal()

      if (this.title) {
        this.addToHistory()
      }
    })

    video && !this.fullscreen && this.config.fullscreen && this.toggleFullScreen()
  },

  beforeDestroy () {
    this.eventSource && this.eventSource.close()

    // Removing cue styling from head
    const styleTag = document.querySelector(`style[name="${this.value}"]`)
    styleTag instanceof Node && document.head.removeChild(styleTag)

    this.isMagnet
      ? this.$ipc.send(this.$eventsList.torrent.destroy.main, this.$store.state.streaming.player.torrent)
      : this.$ipc.send(this.$eventsList.video.stop.main)
  },

  computed: {
    config: {
      get () {
        return this.$store.state.config.config.video
      },
      set () {}
    },
    isMagnet () {
      return !!this.$store.state.streaming.player.torrent
    },
    videoTitle () {
      return this.title || this.name
    }
  },

  methods: {
    onTimelineChangeEvent () {
      const { video, cuesContainer, layout } = this.$refs

      if (video) {
        layout.updateTime()
        cuesContainer.updateTimeline(video.currentTime)

        if (this.isAss) cuesContainer.updateActiveCues()
      }
    },
    onProgress () {
      const { video, layout } = this.$refs

      if (video) {
        layout.updateBuffer()
      }
    },
    onCanPlay () {
      this.waiting = false
    },
    onSeeked () {
      // Needed for subtitle timing
      this.index = 0
    },
    onEnded () {
      const { neighbours } = this.$store.state.streaming.player

      if (neighbours) {
        const { next } = neighbours
        this.$emit('sendNext', next)
      } else {
        this.fullscreen && this.toggleFullScreen()
      }
    },
    onMouseMove (e) {
      if (Math.abs(e.movementX) > 1 || Math.abs(e.movementY) > 1) { this.$refs.layout.reveal() }
    },
    togglePlay () {
      const { video, layout } = this.$refs

      this.paused ? video.play() : video.pause()

      layout.reveal()
    },
    toggleFullScreen () {
      this.$emit('fullscreen')
    },
    actOnWindow (type) {
      this.$parent[type]()
    },
    addToHistory () {
      if (!this.hasAppendedToHistory) {
        this.$store.dispatch('history/append', {
          type: this.isMagnet ? 'Stream' : 'Play',
          text: this.videoTitle
        })

        this.hasAppendedToHistory = true
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

  .cue
    background-color rgba(0, 0, 0, 0)
    -webkit-font-smoothing antialiased
    width 95%
    font-family "Open Sans", sans-serif
    font-weight 500
    line-height 1.25
</style>
