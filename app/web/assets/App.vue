<template lang="pug">
  v-app(dark)
    left-drawer
    right-drawer
    system-bar
    toolbar

    v-content.main-content
      transition(name='page', mode='out-in')
        router-view

    env(v-show='$store.state.NODE_ENV === "development"')
    overlay(v-show='overlay')
    video-modal(v-show='$store.state.streaming.player.show')
    //- mal-form

    //- Used for displaying any info
    v-snackbar(
      :timeout='5000',
      top, right,
      v-model='$store.state.infoSnackbar.show'
    ) {{ $store.state.infoSnackbar.text }}
      v-btn.pink--text(flat, @click='$store.state.infoSnackbar.show = false') Close
</template>

<script>
// Components
import LeftDrawer from 'components/layout/leftNavigationDrawer.vue'
import RightDrawer from 'components/layout/rightNavigationDrawer.vue'
import Toolbar from 'components/layout/toolbar.vue'
import SystemBar from 'components/layout/systemBar.vue'

// Global comps
import VideoModal from 'components/video/modal.vue'
import Overlay from 'components/global/overlay.vue'
import Env from 'components/global/env.vue'

// Mixins
import Meta from 'mixins/global/meta'
import ReadMagnet from 'mixins/global/readMagnet'
import DragDrop from 'mixins/global/dragDrop'

export default {
  name: 'KawAnime',

  components: {
    LeftDrawer,
    RightDrawer,
    Toolbar,
    SystemBar,

    // Global
    VideoModal,
    Overlay,
    Env
  },

  mixins: [Meta, ReadMagnet, DragDrop]
}
</script>

<style lang="stylus">
  @import './stylus/main'

  main
    overflow hidden

  .v-content__wrap
    overflow auto
</style>
