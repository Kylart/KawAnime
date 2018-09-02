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
      v-btn(icon, v-show="update", @click='restartAndUpdate', slot='activator')
        v-icon.green--text file_download
      span Update KawAnime
    //- info-modal
    //- v-tooltip(left)
    //-   v-btn(icon, @click='openInBrowser', slot='activator')
    //-     v-icon open_in_new
    //-   span Open KawAnime in your browser
    settings
    v-btn(icon, @click='toggleRightDrawer')
      v-icon chevron_left
    //- logs
</template>

<script>
// Components
import Settings from 'components/global/settings.vue'
import Logs from 'components/global/logs.vue'

export default {
  name: 'Toolbar',

  components: { Settings, Logs },

  computed: {
    update: {
      get () {
        return this.$store.state.update.isAvailable
      },
      set () {}
    }
  },

  methods: {
    toggleLeftDrawer () {
      this.$store.commit('setLeftDrawer', true)
    },
    toggleRightDrawer () {
      this.$store.commit('setRightDrawer', true)
    },
    openInBrowser () {
      this.$store.dispatch('openInBrowser')
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
