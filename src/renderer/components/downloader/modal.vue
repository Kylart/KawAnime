<template lang="pug">
  v-dialog(absolute, v-model='show', width='65%', @keydown.esc='show = false')
    template(v-slot:activator='{ on: dialog }')
      v-tooltip(left)
        template(v-slot:activator='{ on: tooltip }')
          v-btn(icon, v-on='{ ...dialog, ...tooltip }')
            v-icon file_download
        span Quick download

    layout
</template>

<script>
import Layout from '@/components/downloader/layout.vue'

export default {
  name: 'Downloader-Container',

  components: { Layout },

  computed: {
    show: {
      get () { return this.$store.state.downloader.show },
      set (bool) { this.$store.commit('downloader/showPromptModal', bool) }
    }
  }
}
</script>
