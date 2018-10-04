<template lang="pug">
  v-navigation-drawer(
    app,
    right, v-model='show',
    disable-resize-watcher
  )
</template>

<script>
import Downloader from 'components/downloader/layout.vue'

export default {
  name: 'Right-Drawer',

  components: { Downloader },

  data: () => ({

  }),

  computed: {
    show: {
      get () {
        return this.$store.state.drawer.right
      },
      set (val) {
        this.$store.commit('setRightDrawer', val)
      }
    }
  }
}
</script>
