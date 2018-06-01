<template lang="pug">
  div.video-player(@mousemove='onMouseMove', :style='{ cursor: controlsHidden ? "none" : null }')
    video(ref='video',
      :autoplay='config.autoplay',
      @pause='paused = true',
      @play='paused = false',
      @timeupdate='onTimelineChangeEvent',
      @waiting='waiting = true',
      @canplay='waiting = false',
      @progress='onProgress',
      @seeked='onSeeked',
      @click='togglePlay',
      :src='`/stream/${value}`') Your browser does not support HTML5 video.

    v-progress-circular.main-color--text.video-waiting(dark, indeterminate, v-show='waiting')

    h6.video-title(v-show='!controlsHidden') {{ videoTitle }}

    v-icon.video-play(dark, @click.stop='togglePlay', v-if='paused') play_arrow

    v-btn.video-close(color='mablue', dark, icon, @click.stop='close', v-show='!controlsHidden')
      v-icon close

    .cues-container(v-show='isAss')
      .cue(
        v-for='cue in activeCues',
        :key='cue.id',
        :class="cue.style.join(' ')",
        :style="{top: `${cue.line}%`, left: `${cue.position}%`, transform: `translate(${cue.align}%, 0)`, 'text-align': cue.textAlign}",
        v-html='cue.text'
      )

    v-fade-transition
      div.video-controls(v-show='!controlsHidden')
        player-slider.timeline(dark, hide-details, color='mablue', :step='0', :buffer='buffered', :value='timeline', @input='changeTimeline')

        v-btn(color='mablue', dark, icon, @click.stop='togglePlay')
          v-icon(v-html="paused ? 'play_arrow' : 'pause'")
        v-btn(color='mablue', dark, icon, @click.stop='toggleMute')
          v-icon(v-html="muted ? 'volume_off' : 'volume_up'")
        v-slider.volume(hide-details, color='mablue', dark, :max='100', :value='muted ? 0 : volume', @input='changeVolume')
        div.timer {{ currentTime }}/{{ duration }}
        v-btn(color='mablue', dark, icon, @click.stop='timeForward(-5)')
          v-icon replay_5
        v-btn(color='mablue', dark, icon, @click.stop='timeForward(5)')
          v-icon forward_5
        v-btn(color='mablue', dark, icon, @click.stop='timeForward(90)')
          v-icon fast_forward

        v-btn#fullscreen.right(color='mablue', dark, icon, @click.stop='toggleFullScreen')
          v-icon(v-html="fullscreen ? 'fullscreen_exit' : 'fullscreen'")
        v-menu.right(v-if='$refs.video && !controlsHidden', open-on-hover, offset-overflow, offset-y, top)
          v-btn.subtitles(slot='activator', color='mablue', dark)
            v-icon subtitles
          v-list
            v-list-tile.video-subtitle(v-for='(track,i) in $refs.video.textTracks', :key='i' @click='setTrack(track)')
              v-list-tile-title(:class="{ 'blue--text': track.mode === 'showing' }") {{ track.label }}
</template>

<script>
  import { fromAss } from 'assets/subtitle-parser'
  import SubtitleTiming from 'mixins/subtitles/timing.js'
  import CheckOverlap from 'mixins/subtitles/checkOverlap.js'

  export default {
    name: 'video-player',
    mixins: [SubtitleTiming, CheckOverlap],
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

        this.eventSource.addEventListener('tracks', ({ data }) => {
          const tracks = JSON.parse(data)
          let isStyleSet = false

          tracks.forEach(track => {
            const language = (track.language || 'eng').slice(0, 2)
            textTracks[track.number] = video.addTextTrack('captions', language, language)

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
              this.setTrack(textTracks[track.number])
              this.isPrefLanguageSet = true
            }
          })

          if (tracks.length === 1 && !this.isPrefLanguageSet) {
            this.setTrack(textTracks[Object.keys(textTracks)[0]])
          }
        })

        this.eventSource.addEventListener('subtitle', ({ data }) => {
          const { trackNumber, subtitle } = JSON.parse(data)
          if (trackNumber in textTracks) {
            if (this.isAss) {
              const cues = fromAss.subtitles(subtitle, this.styles, this.info)

              cues.forEach((_cue) => this.cues.push(_cue))
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
        this.$parent.$parent.toggleFullScreen()
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
      close () {
        this.$parent.$parent.close()
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

  .video-player
    background-color black
    line-height 0px
    position relative
    display inline-block
    // height 100%
    height calc(100% - 24px) // Because of system-bar
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
      right 1%
      top 1%

    .cues-container
      position absolute
      left 0
      top 0
      height 100%
      width 100%
      pointer-events: none

      div
        position absolute

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
