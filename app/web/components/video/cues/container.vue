<template lang="pug">
  .cues-container(v-show='bounds.height && bounds.width')
    .cues-r-container(:style='bounds')
      template(v-for='cue in activeCues')
        cue(:cue='cue', :size='bounds')
</template>

<script>
// Components
import Cue from './cue.vue'

// Mixins
import Timing from 'mixins/video/timing'

export default {
  name: 'Cues-container',

  components: { Cue },

  mixins: [ Timing ],

  props: [
    'cues'
  ],

  data: () => ({
    bounds: {}
  }),

  methods: {
    setBounds () {
      console.log('Setting container size')
      const video = document.querySelector('video[name="kawanime-player"]')
      const result = {
        width: null,
        height: null
      }

      if (!video) return

      const { videoWidth, videoHeight, offsetWidth, offsetHeight } = video

      // Ratio of the video's intrisic dimensions
      const videoRatio = videoWidth / videoHeight

      // The ratio of the element's width to its height
      const elementRatio = offsetWidth / offsetHeight

      if (elementRatio > videoRatio) {
        // If the video element is short and wide
        result.width = offsetHeight * videoRatio
        result.height = offsetHeight
      } else {
        // It must be tall and thin, or exactly equal to the original ratio
        result.height = offsetWidth / videoRatio
        result.width = offsetWidth
      }

      this.bounds = {
        width: result.width + 'px',
        height: result.height + 'px'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
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
</style>
