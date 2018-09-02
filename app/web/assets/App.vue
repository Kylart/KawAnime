<template lang="pug">
  v-app(dark)
    left-drawer
    right-drawer
    system-bar
    toolbar

    v-content
      transition(name='page', mode='out-in')
        router-view

      k-footer

    //- env(v-show='$store.state.NODE_ENV === "development"')
    //- overlay(v-show='overlay')
    //- magnets-modal
    //- video-modal(v-show='$store.state.streaming.player.show')
    //- mal-form
    //- info-results
    //- choice-window

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
    SystemBar
  },

  mixins: [Meta, ReadMagnet, DragDrop]
}
</script>

<style lang="stylus">
  @import './stylus/main'
</style>
