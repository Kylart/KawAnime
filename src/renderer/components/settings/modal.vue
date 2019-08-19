<template lang="pug">
  v-dialog(fullscreen, v-model='show')
    template(v-slot:activator='{ on }')
      v-btn(v-on='on', icon)
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
