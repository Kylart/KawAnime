<template lang="pug">
  .video-dialog(
    v-show='show',
    draggable='false',
    :style='style'
  )
    template(v-if='values.show')
      video-player(ref='player', :value='values.link.link', :title='values.link.name')
</template>

<style lang="stylus" scoped>
  .video-dialog
    position absolute
    bottom 0
    right 0
</style>


<script>
  import Draggable from 'mixins/utils/draggable.js'

  export default {
    name: 'Video-Container',

    mixins: [Draggable],
  
    data () {
      return {
        fullscreen: false,
        height: 75,
        width: 75,
        z: 2
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
          'z-index': this.z
        }
      }
    },

    mounted () {
      
    },

    methods: {
      close () {
        this.$store.commit('streaming/close')
      },
      async toggleFullScreen () {
        this.fullscreen = !this.fullscreen
        await this.$axios.get('/_fullScreen')

        if (this.fullscreen) {
          this.z = 3
          this.width = 100
          this.height = 100
        } else {
          this.width = 75
          this.height = 75
          this.z = 2
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
        switch(e.keyCode) {
          case 32: // Space
            this.togglePlay()
            break

          case 27: // Escape
            this.close()
            break

          case 37: // Left
            this.forward(-5)
            break

          case 38: // Top
            this.increaseVolume(5)
            break

          case 39: // Right
            this.forward(5)
            break

          case 40: // Down
            this.increaseVolume(-5)
            break
        }
      }
    },

    watch: {
      show (val) {
        if (val) {
          window.addEventListener('keydown', this.addListeners)
        } else {
          window.removeEventListener('keydown', this.addListeners)
        }
      }
    }
  }
</script>

<style lang="stylus" scoped>
</style>
