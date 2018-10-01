<template lang="pug">
  v-dialog(lazy, absolute, v-model='show', width='65%')
    v-tooltip(slot='activator', lazy, left)
      v-btn(icon, slot='activator')
        v-icon file_download
      span Quick download

    layout(@downloaded='show = false')
</template>

<script>
import Layout from 'components/downloader/layout.vue'

export default {
  name: 'Downloader-Container',

  components: { Layout },

  data: () => ({
    show: false
  })
}
</script>
