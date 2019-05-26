<template lang="pug">
  v-app(:dark='$store.state.config.config.system.darkTheme')
    left-drawer
    // right-drawer
    system-bar
    toolbar

    v-content.main-content
      transition(name='page', mode='out-in')
        router-view

    torrent-dialog
    env(v-show='$store.state.NODE_ENV === "development"')
    overlay(v-show='overlay')
    video-modal(v-show='$store.state.streaming.player.show')
    magnets-modal
    watch-lists-modal
    //- mal-form
    anilist-form

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
import LeftDrawer from '@/components/layout/leftNavigationDrawer.vue'
import RightDrawer from '@/components/layout/rightNavigationDrawer.vue'
import Toolbar from '@/components/layout/toolbar.vue'
import SystemBar from '@/components/layout/systemBar.vue'

// Global comps
import TorrentDialog from '@/components/torrents/dialog.vue'
import MagnetsModal from '@/components/magnets/modal.vue'
import WatchListsModal from '@/components/localLists/modalForm.vue'
import VideoModal from '@/components/video/modal.vue'
import Overlay from '@/components/global/overlay.vue'
import Env from '@/components/global/env.vue'

// Providers form
import MalForm from '@/components/global/malForm.vue'
import AnilistForm from '@/components/global/anilistForm.vue'

// Mixins
import ReadMagnet from '@/mixins/global/readMagnet'
import DragDrop from '@/mixins/global/dragDrop'
import remoteOpen from '@/mixins/global/remoteOpen'

export default {
  name: 'KawAnime',

  components: {
    LeftDrawer,
    RightDrawer,
    Toolbar,
    SystemBar,

    // Global
    MalForm,
    AnilistForm,
    TorrentDialog,
    MagnetsModal,
    WatchListsModal,
    VideoModal,
    Overlay,
    Env
  },

  mixins: [ReadMagnet, DragDrop, remoteOpen],

  beforeCreate () {
    this.$store.dispatch('init')
  }
}
</script>

<style lang="stylus">
  @import './stylus/main'

  main
    overflow hidden

  .v-content__wrap
    overflow auto
</style>
