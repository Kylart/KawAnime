<template lang="pug">
  .video-player(
    @mousemove='onMouseMove',
    :style='{ cursor: !controlsShow ? "none" : null }'
  )
    video(
      ref='video',
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
      :src='`/stream/${value}`'
    ) Your browser does not support HTML5 video.

    cues-container(
      v-show='isAss && trackNumber',
      ref='cuesContainer',
      :cues='currentTrack'
    )

    controls(
      ref='controls',
      :video='$refs.video',
      :title='videoTitle',
      :waiting='waiting',
      :paused='paused',
      :fullscreen='fullscreen',
      @trackChange='setTrack',
      @togglePlay='togglePlay',
      @toggleFullScreen='toggleFullScreen',
      @actOnWindow='actOnWindow',
      @show='controlsShow = true',
      @hide='controlsShow = false',
    )
</template>

<script>
// Comps
import Controls from 'components/video/controls.vue'
import CuesContainer from 'components/video/cues/container.vue'

// Mixins and methods
import Tracks from 'mixins/video/tracks'
import Subtitles from 'mixins/video/subtitles'
import Style from 'mixins/video/getStyle'

export default {
  name: 'video-player',

  components: {
    CuesContainer,
    Controls
  },

  mixins: [ Tracks, Subtitles, Style ],

  props: ['value', 'title'],

  data () {
    return {
      waiting: false,
      paused: true,
      fullscreen: false,
      controlsShow: true,
      isMagnetRe: /^magnet:\?/,
      name: '',
      hasAppendedToHistory: false
    }
  },

  async created () {
    if (this.isMagnet) await this.$axios.get('torrent/init')
  },

  mounted () {
    const { video, controls } = this.$refs

    video.addEventListener('loadedmetadata', () => {
      // We need to get the subtitles only when the torrent is ready to be read.
      // Otherwise, there is no file to get the subtitles from.
      this.eventSource = new window.EventSource(`/tracks/${this.value}`)
      this.setHeight()
      controls.reveal()

      this.eventSource.addEventListener('tracks', ({ data }) => {
        this.handleTracks(data)
        controls.updateSubtitlesData()
      })

      this.eventSource.addEventListener('subtitle', ({ data }) => {
        this.addSubtitle(data)
      })

      this.eventSource.addEventListener('name', ({ data }) => {
        const { name } = JSON.parse(data)

        this.name = name

        this.addToHistory()
      })

      if (this.title) {
        this.addToHistory()
      }
    })

    video && !this.fullscreen && this.config.fullscreen && this.toggleFullScreen()
  },

  beforeDestroy () {
    this.eventSource && this.eventSource.close()
    this.fullscreen && this.toggleFullScreen()

    // Removing cue styling from head
    const { head } = document
    head.removeChild(head.children[head.childElementCount - 1])

    if (this.isMagnet) {
      this.$axios.delete('torrent/remove', {
        params: {
          magnet: this.value
        }
      })
    }
  },

  computed: {
    config: {
      get () {
        return this.$store.state.config.config.video
      },
      set () {}
    },
    isMagnet () {
      return this.isMagnetRe.test(this.value) || this.value.slice(-8) === '.torrent'
    },
    videoTitle () {
      return this.title || this.name
    }
  },

  methods: {
    onTimelineChangeEvent () {
      const { video, cuesContainer, controls } = this.$refs

      if (video) {
        controls.updateTime()
        cuesContainer.updateTimeline(video.currentTime)

        if (this.isAss) cuesContainer.updateActiveCues()
      }
    },
    onProgress () {
      const { video, controls } = this.$refs

      if (video) {
        controls.updateBuffer()
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

    },
    onMouseMove (e) {
      if (Math.abs(e.movementX) > 1 || Math.abs(e.movementY) > 1) { this.$refs.controls.reveal() }
    },
    togglePlay () {
      const { video, controls } = this.$refs

      this.paused ? video.play() : video.pause()

      controls.reveal()
    },
    toggleFullScreen () {
      this.$emit('fullscreen')
      this.fullscreen = !this.fullscreen
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

  .video-subtitle > .list__tile
    padding 0 8px
</style>
