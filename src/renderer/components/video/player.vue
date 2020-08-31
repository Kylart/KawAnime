<template lang="pug">
  .video-player(
    @mousemove='onMouseMove',
    :style='{ cursor: !controls.show ? "none" : null }'
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
      v-on='layout.on',
      v-bind='layout.bind'
    )
</template>

<script>
// Components
import Wrapper from './wrapper.vue'
import Layout from './layout/index.vue'

// Mixins
import Tracks from '@/mixins/video/tracks'
import UserConfig from '@/mixins/video/userConfig.js'
import Tracking from '@/mixins/video/tracking.js'
import LayoutBinds from '@/mixins/video/layout.js'

export default {
  name: 'MpvPlayer',

  components: { Wrapper, Layout },

  mixins: [Tracks, UserConfig, Tracking, LayoutBinds],

  data: () => ({
    mpv: null,
    name: '',
    hasAppendedToHistory: false,

    propertyMap: {
      'percent-pos': 'timeline',
      'media-title': 'name'
    },

    parsedName: null
  }),

  computed: {
    player () {
      return this.$store.state.streaming.player
    },
    controls: {
      get () {
        return this.player.controls
      },
      set ({ name, value }) {
        this.$store.commit('streaming/setControl', { name, value })
      }
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
      this.mpv.command('loadfile', this.player.isTorrent ? `http://localhost:${this.player.port}` : this.player.path)

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

      if (!Object.prototype.hasOwnProperty.call(this.controls, name)) return

      this.controls = { name, value }
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
    togglePlay (bool) {
      this.mpv.property('pause', !this.controls.pause)
      this.controls = { name: 'pause', value: !this.controls.pause }
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
      const name = this.player.isTorrent ? this.player.name : value

      try {
        // Simply parsing and applying the name
        this.parsedName = this.$ipc.sendSync(this.$eventsList.parse.main, name)
        this.controls = {
          name: 'title',
          value: `${this.parsedName.anime_title} - ${this.parsedName.episode_number || 'N/A'}`
        }
      } catch (e) {
        // We fallback to the found value
        this.controls = { name: 'title', value }
      }

      if (!this.hasAppendedToHistory) {
        this.$store.dispatch('history/append', {
          type: this.player.isTorrent ? 'Stream' : 'Play',
          text: this.controls.title
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
