<template lang="pug">
  v-col(cols='4').sound
    v-icon(@click='toggleMute', v-html="isMuted ? 'volume_off' : 'volume_up'")
    v-slider.volume.ma-0.ml-1(
      thumb-label,
      hide-details, dark,
      color='secondary accent-2',
      max='100',
      :value='isMuted ? 0 : controls.volume',
      @input='changeVolume',
    )
</template>

<script>
import { mapGetters } from 'vuex'
import { debounce } from 'lodash'

export default {
  name: 'Volume',

  computed: {
    ...mapGetters('streaming', ['controls']),

    isMuted () {
      return this.controls.muted
    }
  },

  methods: {
    toggleMute () {
      this.$emit('mute')
    },
    changeVolume: debounce(function (value) {
      this.$emit('volume', value)
    }, 300)
  }
}
</script>

<style lang="stylus" scoped>
  .volume
    vertical-align middle
    display inline-block
    width 70%
    padding 0
</style>
