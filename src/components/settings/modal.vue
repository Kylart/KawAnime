<template lang="pug">
  v-dialog(fullscreen, lazy, v-model='show')

    v-btn(slot='activator', icon)
      v-icon settings

    layout(@close='close')
</template>

<script>
import Layout from './layout.vue'

export default {
  name: 'Config-Modal',

  components: { Layout },

  data: () => ({
    show: false
  }),

  methods: {
    close () {
      this.show = false
    }
  }
}
</script>
