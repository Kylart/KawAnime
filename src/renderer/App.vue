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
    kitsu-form

    //- Used for displaying any info
    v-snackbar(
      :timeout='5000',
      top,
      v-model='$store.state.infoSnackbar.show'
    ) {{ $store.state.infoSnackbar.text }}
      v-btn.pink--text(text, @click='$store.state.infoSnackbar.show = false') Close
</template>

<script>
// Components
import LeftDrawer from '@/components/layout/leftNavigationDrawer.vue'
import Toolbar from '@/components/layout/toolbar.vue'
import SystemBar from '@/components/layout/systemBar.vue'

// Global comps
import TorrentDialog from '@/components/torrent/global/dialog.vue'
import MagnetsModal from '@/components/magnets/modal.vue'
import WatchListsModal from '@/components/localLists/modalForm.vue'
import VideoModal from '@/components/video/modal.vue'
import Overlay from '@/components/global/overlay.vue'
import Env from '@/components/global/env.vue'

// Providers form
// import MalForm from '@/components/services/malForm.vue'
import AnilistForm from '@/components/services/anilistForm.vue'
import KitsuForm from '@/components/services/kitsuForm.vue'

// Mixins
import ReadMagnet from '@/mixins/global/readMagnet'
import DragDrop from '@/mixins/global/dragDrop'
import RemoteOpen from '@/mixins/global/remoteOpen'
import Ipc from '@/mixins/global/ipc'

export default {
  name: 'KawAnime',

  components: {
    LeftDrawer,
    Toolbar,
    SystemBar,

    // Providers form
    // MalForm,
    AnilistForm,
    KitsuForm,

    // Global
    TorrentDialog,
    MagnetsModal,
    WatchListsModal,
    VideoModal,
    Overlay,
    Env
  },

  mixins: [ReadMagnet, DragDrop, RemoteOpen, Ipc],

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
