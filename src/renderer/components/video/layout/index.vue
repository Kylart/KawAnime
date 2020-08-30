<template lang="pug">
  v-fade-transition
    .layout-container(v-show='show')

      //- Top title
      video-title

      //- Close and minimize buttons
      video-actions(
        @actOnWindow='actOnWindow'
      )

      //- Controls
      video-controls(
        :subtitles='subtitles',
        :audios='audios',
        @mute='toggleMute',
        @volume='changeVolume',
        @togglePlay='togglePlay',
        @timeForward='timeForward',
        @updateTrack='updateTrack',
        @toggleFullScreen='toggleFullScreen',
        @changeTimeline='changeTimeline'
      )
</template>

<script>
import VideoTitle from './title.vue'
import VideoActions from './actions.vue'
import VideoControls from './controls/index.vue'

export default {
  name: 'Player-Layout',

  components: {
    VideoTitle,
    VideoActions,
    VideoControls
  },

  props: {
    subtitles: {
      type: Object
    },
    audios: {
      type: Object
    }
  },

  data: () => ({
    timeoutID: null
  }),

  mounted () {
    setTimeout(this.hide, 1500)
  },

  computed: {
    show: {
      get () {
        return this.$store.getters['streaming/controls'].show
      },
      set (bool) {
        this.$store.commit('streaming/setControl', { name: 'show', value: bool })
      }
    }
  },

  methods: {
    reveal () {
      this.show = true
      this.$emit('show')

      if (this.timeoutID) clearTimeout(this.timeoutID)
      this.timeoutID = setTimeout(this.hide, 3000)
    },
    hide () {
      this.show = false
      this.$emit('hide')
    },

    togglePlay () {
      this.$emit('togglePlay')
    },
    toggleFullScreen () {
      this.$emit('toggleFullScreen')
    },
    toggleMute () {
      this.$emit('mute')
    },
    actOnWindow (action) {
      this.$emit('actOnWindow', action)
    },
    timeForward (value) {
      this.$emit('timeForward', value)
    },
    changeVolume (value) {
      this.$emit('volume', value)
    },
    changeTimeline (value) {
      this.$emit('seek', value)
    },
    updateTrack (track) {
      this.$emit('updateTrack', track)
    }
  }
}
</script>

<style lang="stylus">
  .layout-container
    position absolute
    top 0
    left 0
    width 100%
    height 100%
</style>
