<template lang="pug">
  v-toolbar.toolbar(
    app, fixed, dense,
    color='indigo',
    clipped-right, clipped-left
  )
    v-toolbar-side-icon(@click.stop='toggleLeftDrawer')
    v-toolbar-title.title.jap かわニメ
    v-spacer
    v-tooltip(left)
      v-btn(icon, v-show='update', @click='restartAndUpdate', slot='activator')
        v-icon.green--text update
      span Update KawAnime
    searcher
    downloader
    settings
    // v-btn(icon, @click='toggleRightDrawer')
    //   v-icon chevron_left
</template>

<script>
// Components
import Settings from '@/components/settings/modal.vue'
import Searcher from '@/components/info/modal.vue'
import Downloader from '@/components/downloader/modal.vue'

export default {
  name: 'Toolbar',

  components: { Settings, Searcher, Downloader },

  computed: {
    update: {
      get () {
        return this.$store.state.update.isAvailable
      },
      set () {}
    },
    drawer: {
      get () {
        return this.$store.state.drawer
      },
      set () {}
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.$store.commit('setLeftDrawer', !this.drawer.left)
    },
    toggleRightDrawer () {
      this.$store.commit('setRightDrawer', !this.drawer.right)
    },
    restartAndUpdate () {
      this.$store.dispatch('update/updateApp')
    }
  }
}
</script>

<style lang="stylus" scoped>
  .title
    overflow hidden
    font-size 30px !important
    line-height 25px !important
</style>
