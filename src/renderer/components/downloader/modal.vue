<template lang="pug">
  v-dialog(absolute, v-model='show', width='65%')
    template(v-slot:activator='{ on: dialog }')
      v-tooltip(left)
        template(v-slot:activator='{ on: tooltip }')
          v-btn(icon, v-on='{ ...dialog, ...tooltip }')
            v-icon file_download
        span Quick download

    layout(@downloaded='show = false')
</template>

<script>
import Layout from '@/components/downloader/layout.vue'

export default {
  name: 'Downloader-Container',

  components: { Layout },

  data: () => ({
    show: false
  })
}
</script>
