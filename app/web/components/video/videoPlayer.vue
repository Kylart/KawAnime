<template lang="pug">
  div.video-player(@mousemove='onMouseMove', :style='{ cursor: controlsHidden ? "none" : null }')
    video(ref='video',
      :autoplay='config.autoplay',
      @pause='paused = true',
      @play='paused = false',
      @timeupdate='onTimelineChangeEvent',
      @waiting='waiting = true',
      @canplay='onCanPlay',
      @progress='onProgress',
      @seeked='onSeeked',
      @click='togglePlay',
      @dblclick='toggleFullScreen',
      :src='`/stream/${value}`') Your browser does not support HTML5 video.

    v-progress-circular.main-color--text.video-waiting(dark, indeterminate, v-show='waiting')

    h6.video-title(v-show='!controlsHidden') {{ videoTitle }}

    v-icon.video-play(dark, @click.stop='togglePlay', v-if='paused') play_arrow

    v-btn.video-close(color='mablue', dark, icon, @click.stop='actOnWindow("close")', v-show='!controlsHidden')
      v-icon close

    v-btn.video-size(color='mablue', dark, icon, @click.stop='actOnWindow("minimize")', v-show='!controlsHidden && !$parent.fullscreen')
      v-icon {{ $parent.isMinimized ? 'keyboard_arrow_up' : 'keyboard_arrow_down' }}

    .cues-container(v-show='trackNum && isAss')
      .cues-r-container(:style='cuesContainerStyle')
        template(v-for='cue in activeCues')
          transition(
            v-if='cue.hasAnimation',
            name='cue-transition',
            :key='cue.masterId',
            @before-enter='cue.beforeEnter',
            @enter='cue.enter',
            @leave='cue.leave',
            :css='false'
          )
            .cue(
              v-if='cue.show',
              :class="cue.style.join(' ')",
              :style="getStyle(cue)",
              v-html='cue.text'
            )
          .cue(
              v-else,
              :key='cue.masterId',
              :class="cue.style.join(' ')",
              :style="getStyle(cue)",
              v-html='cue.text'
            )

    v-fade-transition
      div.video-controls(v-show='!controlsHidden')
        player-slider.timeline(dark, hide-details, color='mablue', :step='0', :buffer='buffered', :value='timeline', @input='changeTimeline')

        v-btn(color='mablue', dark, icon, @click.stop='togglePlay')
          v-icon(v-html="paused ? 'play_arrow' : 'pause'")
        v-btn(color='mablue', dark, icon, @click.stop='toggleMute')
          v-icon(v-html="muted ? 'volume_off' : 'volume_up'")
        v-slider.volume(hide-details, color='mablue', dark, :max='100', :value='muted ? 0 : volume', thumb-label, @input='changeVolume')
        div.timer {{ currentTime }}/{{ duration }}
        v-tooltip(top)
          span Rewind 5s
          v-btn(color='mablue', dark, icon, @click.stop='timeForward(-5)', slot='activator')
            v-icon replay_5
        v-tooltip(top)
          span Fast forward 5s
          v-btn(color='mablue', dark, icon, @click.stop='timeForward(5)', slot='activator')
            v-icon forward_5
        v-tooltip(top)
          span Skip 1m25 (op&ed)
          v-btn(color='mablue', dark, icon, @click.stop='timeForward(85)', slot='activator')
            v-icon fast_forward

        v-btn#fullscreen.right(color='mablue', dark, icon, @click.stop='toggleFullScreen')
          v-icon(v-html="fullscreen ? 'fullscreen_exit' : 'fullscreen'")
        v-menu.right(v-if='$refs.video && !controlsHidden', open-on-hover, offset-overflow, offset-y, top)
          v-btn.subtitles(slot='activator', color='mablue', dark)
            v-icon subtitles
          v-list
            v-list-tile.video-subtitle(v-for='(num, i) in Object.keys(numToLang)', :key='i' @click='setSubLanguage(num)')
              v-list-tile-title(:class="{ 'blue--text': +num === trackNum }") {{ numToLang[num] }}
</template>

<script>
// Comps
import PlayerSlider from 'components/video/playerSlider.vue'

// Mixins and methods
import { fromAss } from 'assets/subtitle-parser'
import Subtitle from 'mixins/subtitles'

export default {
  name: 'video-player',

  components: {
    PlayerSlider
  },

  mixins: [Subtitle],

  props: ['value', 'title'],

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
      autoplay: true,
      isAss: false,
      styles: null,
      info: null,
      isMagnetRe: /^magnet:\?/,
      name: '',
      isPrefLanguageSet: false,
      hasAppendedToHistory: false
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
  async created () {
    if (this.isMagnet) await this.$axios.get('torrent/init')
  },
  mounted () {
    const { video } = this.$refs
    const textTracks = {}

    video.addEventListener('loadedmetadata', () => {
      // We need to get the subtitles only when the torrent is ready to be read.
      // Otherwise, there is no file to get the subtitles from.
      this.eventSource = new window.EventSource(`/tracks/${this.value}`)
      this.setHeight()

      this.eventSource.addEventListener('tracks', ({ data }) => {
        const tracks = JSON.parse(data)
        let isStyleSet = false

        tracks.forEach(track => {
          const language = (track.language || 'eng').slice(0, 2)
          const trackNumber = +track.number
          this.allCues[trackNumber] = []

          this.numToLang[trackNumber] = language

          if (track.type === 'ass') {
            this.isAss = true
            const parsedTracks = fromAss.tracks(tracks)
            this.styles = parsedTracks.styles
            this.info = parsedTracks.info

            // Let's suppose each track have the same style and that only the language of each changes.
            if (!isStyleSet) {
              fromAss.setStyles(this.styles, this.value, this.info)
              isStyleSet = true
            }
          }

          if (language === this.config.preferredLanguage) {
            this.isPrefLanguageSet = true
            this.trackNum = trackNumber
          }
        })

        if (tracks.length === 1 && !this.isPrefLanguageSet) {
          this.trackNum = +Object.keys(this.numToLang)[0]
        }
      })

      this.eventSource.addEventListener('subtitle', ({ data }) => {
        const { trackNumber, subtitle } = JSON.parse(data)
        if (trackNumber in this.allCues) {
          if (this.isAss) {
            const cue = fromAss.subtitles(subtitle, this.styles, this.info)

            this.allCues[trackNumber].push(cue)
          } else {
            const cue = new window.VTTCue(subtitle.time / 1000, (subtitle.time + subtitle.duration) / 1000, subtitle.text)
            textTracks[trackNumber].addCue(cue)
          }
        }
      })

      if (this.title) {
        this.addToHistory()
      }

      this.eventSource.addEventListener('name', ({ data }) => {
        const { name } = JSON.parse(data)

        this.name = name

        this.addToHistory()
      })
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

  methods: {
    formatTime (time = 0) {
      const minutes = ('0' + Math.floor(time / 60)).slice(-2)
      const seconds = ('0' + Math.floor(time % 60)).slice(-2)

      return `${minutes}:${seconds}`
    },
    togglePlay () {
      const { video } = this.$refs
      this.showControls()
      this.paused ? video.play() : video.pause()
    },
    toggleMute () {
      this.muted = this.$refs.video.muted = !this.muted
    },
    toggleFullScreen () {
      this.$parent.toggleFullScreen()
      this.fullscreen = !this.fullscreen
    },
    onTimelineChangeEvent () {
      const { video } = this.$refs
      if (video) {
        this.timeline = 100 / video.duration * video.currentTime
        this.currentTime = this.formatTime(video.currentTime)
        this.duration = this.formatTime(video.duration)
        this.rawTime = video.currentTime

        if (this.isAss) this.updateActiveCues()
      }
    },
    onProgress () {
      const { video } = this.$refs
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
    onCanPlay () {
      this.waiting = false
    },
    onSeeked () {
      this.index = 0
    },
    changeTimeline (value) {
      const { video } = this.$refs
      if (video) { video.currentTime = video.duration * ((this.timeline = value) / 100) }
    },
    timeForward (value) {
      const { video } = this.$refs

      if (video) {
        video.currentTime += value
      }
    },
    changeVolume (value) {
      if (this.$refs.video) this.$refs.video.volume = (this.volume = value) / 100
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
        this.$refs.video.volume = newVolume / 100
      }
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
      const { video } = this.$refs
      if (track.mode === 'showing') {
        track.mode = 'hidden'
      } else {
        for (const track of video.textTracks) {
          track.mode = 'hidden'
        }

        track.mode = 'showing'
      }
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
  .cue
    background-color rgba(0, 0, 0, 0)
    -webkit-font-smoothing antialiased
    width 95%
    font-family "Open Sans", sans-serif
    line-height 1.25

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

    .video-close
      cursor pointer
      position absolute
      right 5px
      top 1%

    .video-size
      cursor pointer
      position absolute
      right 50px
      top 1%

    .cues-container
      position absolute
      left 0
      top 0
      height 100%
      width 100%
      pointer-events: none
      display flex
      align-items center
      justify-content center

      div
        position absolute

      .cues-r-container
        position relative
        width 100%

    .video-play
      cursor pointer
      position absolute
      left 50%
      top 50%
      transform translate(-50%, -50%)
      height 100px
      width 100px
      font-size 100px

    .video-title
        position absolute
        width 80%
        left 10%
        top 4%
        text-align center
        line-height 22px
        font-weight 700
        -webkit-text-stroke 1px black

    .video-controls
      background linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.07), rgba(0, 0, 0, 0.0))
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
