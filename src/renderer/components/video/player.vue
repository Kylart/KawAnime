<template lang="pug">
  .video-player(
    @mousemove='onMouseMove',
    :style='{ cursor: !layoutShow ? "none" : null }'
  )

    wrapper(
      ref='video',
      name='kawanime-player',
      :onReady='handleMPVReady',
      :onPropertyChange='handlePropertyChange',
      @toggleFullScreen='toggleFullScreen',
      @togglePlay='togglePlay'
    )

    layout(
      ref='layout',
      :timeline='timeline',
      :pause='pause',
      :mute='mute',
      :duration='duration',
      :title='name',
      :hasSubs='hasSubs',
      :currentLang='currentSubLang',
      :subs='subs'
      @seek='seek',
      @timeForward='timeForward',
      @volume='setVolume',
      @toggleFullScreen='toggleFullScreen',
      @togglePlay='togglePlay',
      @trackChange='setTrack',
      @actOnWindow='actOnWindow',
      @mute='toggleMute',
      @show='layoutShow = true',
      @hide='layoutShow = false'
    )
</template>

<script>
// Components
import Wrapper from './wrapper.vue'
import Layout from './layout.vue'

// Mixins
import UserConfig from '@/mixins/video/userConfig.js'

export default {
  name: 'MpvPlayer',

  components: { Wrapper, Layout },

  mixins: [ UserConfig ],

  data () {
    return {
      mpv: null,
      pause: false,
      timeline: 0,
      duration: 0,
      waiting: false,
      name: '',
      mute: false,
      hasAppendedToHistory: false,

      layoutShow: true,

      propertyMap: {
        'percent-pos': 'timeline',
        'media-title': 'name'
      },

      hasSubs: false,
      tracks: {},
      currentSubLang: null,

      parsedName: null
    }
  },

  props: {
    filepath: String,
    torrent: [ String, null, undefined ],
    port: [ Number, null, undefined ]
  },

  computed: {
    controls: {
      get () {
        return this.$store.state.streaming.player.controls
      },
      set ({ name, value }) {
        this.$store.commit('streaming/setControl', { name, value })
      }
    },
    subs () {
      return Object.keys(this.tracks)
        .reduce((acc, trackNumber) => {
          const { type, lang } = this.tracks[trackNumber]

          if (type === 'sub') acc[trackNumber] = (lang || 'unknown').slice(0, 2)

          return acc
        }, {})
    }
  },

  methods: {
    actOnWindow (type) {
      this.$parent[type]()
    },
    handleMPVReady (mpv) {
      this.mpv = mpv;
      [
        'pause',
        'percent-pos',
        'duration',
        'media-title',
        'track-list/count',
        'volume',
        'eof-reached',
        'mute'
      ].forEach(this.mpv.observe)

      this.mpv.property('hwdec', 'auto')
      this.mpv.command('loadfile', this.torrent ? `http://localhost:${this.port}` : this.filepath)

      this.$emit('ready')
      this.triggerConfigActions()
    },
    handlePropertyChange (name, value) {
      name = this.propertyMap[name] || name

      if (name.match(/track-list\//)) return this.handleTracks(name, value)
      if (name.match(/^volume$/)) return this.setVolume(value)
      if (name.match(/^eof-reached$/) && value) return this.$emit('sendNext')

      // Originally media-title
      if (name.match(/^name$/)) return this.addToHistory(value)

      if (!this.hasOwnProperty(name)) return

      this.$set(this, name, value)
    },
    handleTracks (propertyName, value) {
      if (propertyName === 'track-list/count') {
        if (!value) return

        for (let i = 1; i <= value; ++i) {
          this.mpv.observe(`track-list/${i}/type`)
          this.mpv.observe(`track-list/${i}/lang`)
          this.mpv.observe(`track-list/${i}/default`)
          this.mpv.observe(`track-list/${i}/id`)
          this.mpv.observe(`track-list/${i}/type`)
          this.mpv.observe(`track-list/${i}/src`)
          this.mpv.observe(`track-list/${i}/title`)
          this.mpv.observe(`track-list/${i}/lang`)
          this.mpv.observe(`track-list/${i}/selected`)
        }

        return
      }

      if (propertyName.match(/track-list\/\d+/)) {
        const parts = propertyName.split('/')
        const trackNumber = +parts[1]
        const type = parts[2]
        const storedTrack = this.tracks[trackNumber] || {}

        if (value === 'sub' && !this.hasSubs) this.hasSubs = true

        this.$set(this.tracks, trackNumber, { ...storedTrack, [type]: value })

        // Setting current language for the controls to know
        if (this.tracks[trackNumber] && this.tracks[trackNumber].type && this.tracks[trackNumber].type === 'sub') {
          if (this.tracks[trackNumber].selected && this.tracks[trackNumber].lang) {
            this.$set(this, 'currentSubLang', this.tracks[trackNumber].lang.slice(0, 2))
          }
        }
      }
    },
    setTrack (track) {
      const { selected, id } = this.tracks[track]

      if (selected) {
        // Disabling selected track
        this.mpv.property('sid', 'no')

        // internal tracking
        this.$set(this.tracks[track], 'selected', false)
        this.currentSubLang = null
      } else {
        // Enabling new track
        this.mpv.property('sid', id)

        // internal tracking
        this.$set(this.tracks[track], 'selected', true)
        this.currentSubLang = this.subs[track]
      }
    },
    seek (value) {
      this.mpv.command('seek', value, 'absolute-percent')
    },
    timeForward (value) {
      this.mpv.command('seek', value)
    },
    setVolume (value, relative) {
      if (this.mpv) {
        if (relative) value = this.controls.volume + value

        this.mpv.property('volume', value)
        this.controls = { name: 'volume', value }
      }
    },
    toggleMute () {
      this.mpv.property('mute', !this.controls.muted)
      this.controls = { name: 'muted', value: !this.controls.muted }
    },
    togglePlay (e) {
      if (!this.duration) return

      this.mpv.property('pause', !this.pause)
    },
    toggleFullScreen () {
      this.$emit('fullscreen')
    },

    onMouseMove (e) {
      if (Math.abs(e.movementX) > 1 || Math.abs(e.movementY) > 1) this.$refs.layout.reveal()
    },

    /**
     * Will add current file to the history
     *
     * @param {String} value Title as found by MPV
     */
    addToHistory (value) {
      // If we are streaming a torrent, the name will come from the torrent's name
      // Otherwise, it will be from the file itself once parsed by MPV.
      const name = this.torrent ? this.$store.state.streaming.player.name : value

      try {
        // Simply parsing and applying the name
        this.parsedName = this.$ipc.sendSync(this.$eventsList.parse.main, name)
        this.name = `${this.parsedName.anime_title} - ${this.parsedName.episode_number || 'N/A'}`
      } catch (e) {
        // We fallback to the found value
        this.name = value
      }

      if (!this.hasAppendedToHistory) {
        this.$store.dispatch('history/append', {
          type: this.torrent ? 'Stream' : 'Play',
          text: this.name
        })

        this.hasAppendedToHistory = true
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .video-player
    background-color black
    line-height 0px
    position relative
    display inline-block
    height 100%
    width 100%

    &:fullscreen
      width 100vw
</style>
