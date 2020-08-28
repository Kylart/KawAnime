<template lang="pug">
  .timer {{ formatTime(timeline) }} / {{ formatTime(controls.duration) }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Timestamp',

  computed: {
    ...mapGetters('streaming', ['controls']),

    timeline () {
      return (this.controls.timeline / 100) * this.controls.duration
    }
  },

  methods: {
    formatTime (time = 0) {
      const minutes = ('0' + Math.floor(time / 60)).slice(-2)
      const seconds = ('0' + Math.floor(time % 60)).slice(-2)

      return `${minutes}:${seconds}`
    }
  }
}
</script>

<style lang="stylus" scoped>
  .timer
    padding 0 4px
    font-size 14px
    line-height 15px
    letter-spacing 0.04em
    font-weight 300
    text-align center
</style>
