<template lang="pug">
  v-toolbar.toolbar(
    app, fixed, dense,
    color='indigo',
    clipped-right, clipped-left
  )
    v-toolbar-side-icon(@click.stop='toggleLeftDrawer')
    v-toolbar-title.title.jap かわニメ
    v-spacer
    template(v-if='update')
      v-tooltip(left, lazy)
        v-btn(icon, @click='restartAndUpdate', slot='activator')
          v-icon.green--text update
        span Update KawAnime
    searcher
    downloader
    settings

    v-tooltip(top)
      v-btn(
        @click='openChangelog',
        slot='activator',
        icon
      )
        v-icon fiber_new
      span What's new in version v{{ version }}?
</template>

<script>
// Components
import Settings from '@/components/settings/modal.vue'
import Searcher from '@/components/info/modal.vue'
import Downloader from '@/components/downloader/modal.vue'

export default {
  name: 'Toolbar',

  components: { Settings, Searcher, Downloader },

  data: () => ({
    version: process.env.VUE_APP_KAWANIME_VERSION,
    changelogLink: `https://github.com/Kylart/KawAnime/releases/tag/v${process.env.VUE_APP_KAWANIME_VERSION}`
  }),

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
    },
    openChangelog () {
      this.$electron.shell.openExternal(this.changelogLink)
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
