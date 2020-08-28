<template lang="pug">
  v-btn.fullscreen(color='secondary accent-2', small, outlined, icon, @click='toggleFullScreen')
    v-icon(v-html="controls.fullscreen ? 'fullscreen_exit' : 'fullscreen'")
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Fullscreen',

  computed: {
    ...mapGetters('streaming', ['controls'])
  },

  methods: {
    toggleFullScreen () {
      this.$emit('toggleFullScreen')
    }
  }
}
</script>
