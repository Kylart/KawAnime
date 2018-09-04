<template lang="pug">
  v-layout(row, wrap)
    v-flex(xs12) {{ current }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Current',

  computed: {
    ...mapGetters('info', {
      allInfo: 'getInfo'
    }),
    current: {
      get () {
        return this.$store.state.releases.current
      },
      set (val) {
        this.$store.commit('releases/setCurrent', val)
      }
    },
    info () {
      return this.allInfo[this.current]
    }
  }
}
</script>
