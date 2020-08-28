<template lang="pug">
  h6.video-title {{ controls.title }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'VideoTitle',

  computed: {
    ...mapGetters('streaming', ['controls'])
  }
}
</script>

<style lang="stylus" scoped>
  .video-title
    position absolute
    width 80%
    left 10%
    top 4%
    text-align center
    line-height 22px
    font-weight 700
    -webkit-text-stroke 1px black
</style>
