<template lang="pug">
  v-col(cols='4').text-center
    v-tooltip(top)
      span Rewind 5s
      template(v-slot:activator='{ on }')
        v-icon(@click='timeForward(-5)', v-on='on') replay_5

    v-icon(large, @click='togglePlay', v-html='controls.pause ? "play_arrow" : "pause"')

    v-tooltip(top)
      span Fast forward 5s
      template(v-slot:activator='{ on }')
        v-icon(@click='timeForward(5)', v-on='on') forward_5

    v-tooltip(top)
      span Skip 1m25 (op & ed)
      template(v-slot:activator='{ on }')
        v-icon(@click='timeForward(85)', v-on='on') fast_forward
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ControlsActions',

  computed: {
    ...mapGetters('streaming', ['controls'])
  },

  methods: {
    timeForward (value) {
      this.$emit('timeForward', value)
    },
    togglePlay () {
      this.$emit('togglePlay')
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
