<template lang="pug">
  v-app-bar.toolbar(
    app, fixed, dense,
    color='secondary',
    clipped-left
  )
    v-app-bar-nav-icon(@click='toggleMiniDrawer')
      v-icon {{ miniDrawer ? 'chevron_right' : 'chevron_left' }}
    v-toolbar-title.app-title.jap かわニメ
    v-spacer
    template(v-if='update')
      v-tooltip(left)
        template(v-slot:activator='{ on }')
          v-btn(icon, @click='restartAndUpdate', v-on='on')
            v-icon.green--text update
        span Update KawAnime
    searcher
    downloader
    settings

    v-tooltip(top)
      template(v-slot:activator='{ on }')
        v-btn(
          @click='openChangelog',
          v-on='on',
          icon
        )
          v-icon fiber_new
      span What's new in version v{{ version }}?
</template>

<script>
import { config } from 'vendor'

// Components
import Settings from '@/components/settings/modal.vue'
import Searcher from '@/components/info/dialog.vue'
import Downloader from '@/components/downloader/modal.vue'

export default {
  name: 'Toolbar',

  components: { Settings, Searcher, Downloader },

  data: () => ({
    version: config.kawanime.version,
    changelogLink: `https://github.com/Kylart/KawAnime/releases/tag/v${config.kawanime.version}`
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
    },
    miniDrawer: {
      get () {
        return this.drawer.mini
      },
      set (bool) {
        this.$store.commit('setMiniDrawer', bool)
      }
    }
  },

  methods: {
    toggleMiniDrawer () {
      this.miniDrawer = !this.miniDrawer
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
  .app-title
    overflow hidden
    font-size 30px !important
    line-height 25px !important
</style>
