<template lang="pug">
  .video-dialog-container(draggable='false', :style="{ 'z-index': z }")
    v-scale-transition
      .video-dialog(v-show='show', :style='style')
        template(v-if='values.show')
          player(ref='player', :value='values.link.link', :title='values.link.name')

    v-fade-transition
      .video-overlay(v-show='show && !isMinimized')
</template>

<script>
import Player from 'components/video/player.vue'

export default {
  name: 'Video-Container',

  components: {
    Player
  },

  data () {
    return {
      fullscreen: false,
      height: 85,
      width: 85,
      bottom: 0,
      right: 0,
      z: 3,
      isMinimized: false
    }
  },

  computed: {
    values () {
      return this.$store.state.streaming.player
    },
    show () {
      return this.values.show
    },
    style () {
      return {
        width: this.width + '%',
        height: this.height + '%',
        bottom: this.bottom + '%',
        right: this.right + '%',
        'z-index': this.z
      }
    },
    listeners () {
      return {
        32: () => this.togglePlay(),
        27: () => this.close(),
        37: () => this.forward(-5),
        39: () => this.forward(5),
        38: () => this.increaseVolume(5),
        40: () => this.increaseVolume(-5)
      }
    }
  },

  methods: {
    center () {
      this.$nextTick(() => {
        const el = document.getElementsByTagName('video')[0]

        if (el) {
          const { clientHeight: videoHeight, clientWidth: videoWidth } = el
          const { innerHeight: winHeight, innerWidth: winWidth } = window

          this.bottom = (((winHeight - videoHeight) / winHeight) * 100) / 2
          this.right = (((winWidth - videoWidth) / winWidth) * 100) / 2
        }
      })
    },
    close () {
      this.$store.commit('streaming/close')
    },
    minimize () {
      if (this.isMinimized) {
        this.width = 85
        this.height = 85

        this.center()
      } else {
        this.width = 40
        this.height = 40

        this.bottom = 0
        this.right = 0
      }

      this.$nextTick(() => this.$refs.player.setHeight())

      this.isMinimized = !this.isMinimized
    },
    async toggleFullScreen () {
      this.fullscreen = !this.fullscreen
      await this.$axios.get('/_fullScreen', { params: { bool: this.fullscreen } })

      this.isMinimized = false

      if (this.fullscreen) {
        this.z = 4
        this.width = 100
        this.height = 100
        this.bottom = 0
        this.right = 0
      } else {
        this.width = 85
        this.height = 85
        this.z = 3
        this.center()
      }

      this.$nextTick(() => this.$refs.player.setHeight())
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
    }
  },

  watch: {
    show (val) {
      if (val) {
        this.center()

        if (this.isMinimized) {
          this.minimize()
        }

        window.addEventListener('keydown', this.addListeners)
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
    pointer-events none
    user-select none

    .video-dialog
      position absolute
      transition bottom 0.25s ease, right 0.25s ease
      pointer-events all

    .video-overlay
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      background-color rgba(0, 0, 0, 0.5)
      pointer-events all
</style>
