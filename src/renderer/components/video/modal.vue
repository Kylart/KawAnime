<template lang="pug">
  .video-dialog-container(draggable='false', :style="{ 'z-index': controls.z }")
    v-scale-transition
      .video-dialog(v-show='show', :style='style')
        template(v-if='show')
          player(
            ref='player',
            :key='controls.playerKey',
            @sendNext='setNext',
            @fullscreen='toggleFullScreen',
            @ready='center()',
            :filepath='values.path',
            :torrent='values.torrent',
            :port='values.port'
          )

    v-fade-transition
      .video-overlay(v-show='show && !controls.isMinimized')
</template>

<script>
import Player from '@/components/video/player.vue'

export default {
  name: 'Video-Container',

  components: {
    Player
  },

  computed: {
    controls: {
      get () {
        return this.values.controls
      },
      set ({ name, value }) {
        this.$store.commit('streaming/setControl', { name, value })
      }
    },

    values () {
      return this.$store.state.streaming.player
    },
    show () {
      return this.values.show
    },
    title () {
      return this.values.name
    },
    style () {
      return {
        width: this.controls.width + '%',
        height: this.controls.height + '%',
        bottom: this.controls.bottom + '%',
        right: this.controls.right + '%',
        'z-index': this.controls.z
      }
    },
    listeners () {
      return {
        // Escape key
        27: () => this.controls.fullscreen ? this.toggleFullScreen() : this.close()
      }
    }
  },

  methods: {
    center () {
      this.$nextTick(() => {
        const el = document.querySelector('.video-player')

        if (el) {
          const { clientHeight: videoHeight, clientWidth: videoWidth } = el
          const { innerHeight: winHeight, innerWidth: winWidth } = window

          this.controls = { name: 'bottom', value: (((winHeight - videoHeight) / winHeight) * 100) / 2 }
          this.controls = { name: 'right', value: (((winWidth - videoWidth) / winWidth) * 100) / 2 }
        }
      })
    },
    close () {
      this.$store.commit('streaming/close')
    },
    minimize () {
      if (this.controls.isMinimized) {
        this.controls = { name: 'width', value: 85 }
        this.controls = { name: 'height', value: 85 }

        this.center()
      } else {
        this.controls = { name: 'width', value: 40 }
        this.controls = { name: 'height', value: 40 }

        this.controls = { name: 'bottom', value: 0 }
        this.controls = { name: 'right', value: 0 }
      }

      this.controls = { name: 'isMinimized', value: !this.controls.isMinimized }
    },
    async toggleFullScreen () {
      this.controls = { name: 'fullscreen', value: !this.controls.fullscreen }
      this.$setFullScreen(this.controls.fullscreen)

      this.controls = { name: 'isMinimized', value: false }

      if (this.controls.fullscreen) {
        this.controls = { name: 'z', value: 10 }
        this.controls = { name: 'width', value: 100 }
        this.controls = { name: 'height', value: 100 }
        this.controls = { name: 'bottom', value: 0 }
        this.controls = { name: 'right', value: 0 }
      } else {
        this.controls = { name: 'width', value: 85 }
        this.controls = { name: 'height', value: 85 }
        this.controls = { name: 'z', value: 5 }
        this.center()
      }
    },
    forward (value) {
      this.$refs.player.timeForward(value)
    },
    increaseVolume (value) {
      this.$refs.player.increaseVolume(value)
    },
    togglePlay () {
      this.$refs.player.togglePlay()
    },
    addListeners (e) {
      if (this.listeners.hasOwnProperty(e.keyCode)) this.listeners[e.keyCode]()
    },
    setNext (next) {
      // Doing this allows us to rebuild the player from scratch, making
      // all the work needed for the subtitles, history and stuff...
      this.controls = { name: 'playerKey', value: Math.random() }

      this.$nextTick(() => {
        this.$store.dispatch('streaming/play', {
          isTorrent: next.hasOwnProperty('link'),
          link: next.path || next.link,
          name: `${next.title} - ${next.ep}`,
          neighbours: null
        })
      })
    }
  },

  watch: {
    async show (val) {
      if (val) {
        if (this.isMinimized) {
          this.minimize()
        }

        window.addEventListener('keydown', this.addListeners)

        await this.$store.dispatch('streaming/getNeighbours')
      } else {
        window.removeEventListener('keydown', this.addListeners)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .video-dialog-container
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    user-select none

    .video-dialog
      min-height 320px
      min-width 500px
      position absolute
      transition bottom 0.25s ease, right 0.25s ease

    .video-overlay
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      background-color rgba(0, 0, 0, 0.5)
</style>
